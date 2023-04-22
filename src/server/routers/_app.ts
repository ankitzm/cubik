import { procedure, router } from '../trpc';
import { commentRouter } from './comment';
import { projectsRouter } from './projects';
import { userRouter } from './user';
import { roundRouter } from './round';
import { poolRouter } from './pool';

export const appRouter = router({
  ping: procedure.query(() => 'Its working 🚀'),
  user: userRouter,
  project: projectsRouter,
  comment: commentRouter,
  round: roundRouter,
  pool: poolRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
