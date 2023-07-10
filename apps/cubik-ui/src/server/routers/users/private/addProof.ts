import { Prisma } from '@cubik/database';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { protectedProcedure } from '~/server/trpc';
import { prisma } from '~/server/utils/prisma';
import { UserProof } from '~/types/user';
import { ProofType } from '~/utils/program/contract';

export const addProof = protectedProcedure
  .input(
    z.object({
      name: z.enum([
        'LAMPORT',
        'SUPERTEAM',
        'MONKEYDAO',
        'CIVIC',
        'SOCIAL',
        'GOOGLE',
        'DROPS01',
        'GITHUB',
        'CUBIKGRANTEE',
      ]),
      tx: z.string().nonempty(),
      email: z.string().optional(),
      githubUsername: z.string().optional(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const user = ctx.session.user;
    let otherInfo = {};
    let otherInfoProof = {};
    if (input.name === 'GOOGLE') {
      otherInfo = {
        email: input.email,
      };
      const check = await prisma.userModel.findFirst({
        where: {
          email: input.email,
        },
      });
      if (check) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          cause: 'The Google Account is Already linked by another user',
          message: 'The Google Account is Already linked by another user',
        });
      }
    }
    if (input.name === 'GITHUB') {
      otherInfoProof = {
        githubUsername: input.githubUsername,
      };

      const check = await prisma.userModel.findFirst({
        where: {
          proof: {
            path: '$[*].githubUsername',
            array_contains: input.githubUsername,
          },
        },
      });

      if (check) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          cause: 'The Github Account is Already linked by another user',
          message: 'The Github Account is Already linked by another user',
        });
      }
    }

    const res = await prisma.userModel.findUnique({
      where: {
        id: user.id,
      },
    });
    if (!res) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'User not found',
      });
    }

    const alreadyClaimedProofs = res?.proof as unknown as UserProof[];

    if (alreadyClaimedProofs.find((e) => e.name === input.name)) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Proof already claimed',
      });
    }
    const updatedUser = await prisma.userModel.update({
      where: {
        id: user.id,
      },
      data: {
        ...otherInfo,
        proof: (alreadyClaimedProofs
          ? [
              ...(alreadyClaimedProofs as unknown as ProofType[]),
              {
                name: input.name as ProofType,
                timestamp: new Date(),
                tx: input.tx,
                ...otherInfoProof,
              },
            ]
          : [
              {
                name: input.name as ProofType,
                timestamp: new Date(),
                tx: input.tx,
                otherInfoProof,
              },
            ]) as unknown as Prisma.JsonArray,
      },
    });

    return updatedUser;
  });
