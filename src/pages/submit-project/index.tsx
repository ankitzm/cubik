import {
  Box,
  Card,
  CardHeader,
  Center,
  Container,
  HStack,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import type { ProjectsModel } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { v4 as uuidV4 } from 'uuid';
import { array, object, string } from 'yup';
import { StepOne, StepThree, StepTwo } from '~/components/pages/create-project';
import { trpc } from '~/utils/trpc';
import { uploadToCloudinary } from '~/utils/upload';
type SubmitProjectProps = {
  onSubmit: (project: Project) => void;
};
type Project = ProjectsModel;

export type FormData = {
  projectName: string;
  tagline: string;
  category: { label: string; value: string; colorScheme: string }[];
  logo: FileList;
  twitter: string;
  github: string;
  projectLink: string;
  telegram: string;
  discord: string;
  description: string;
};

const SubmitProject: React.FC<SubmitProjectProps> = ({ onSubmit }) => {
  const [step, setStep] = useState<number>(1);
  const router = useRouter();
  const [LoadingSubmit, setLoadingSubmit] = useState<boolean>(false);
  const { data: session } = useSession();
  const createProjectMutation = trpc.project.create.useMutation();
  // const userProjects = trpc.project.findPubkey.useQuery({
  //   publickey: session?.user.mainWallet,
  // });
  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
    getValues,
  } = useForm<FormData>({
    resolver: yupResolver(
      object().shape({
        projectName: string()
          .required("Project name can't be empty")
          .max(36, 'Must be at most 36 characters'),
        tagline: string()
          .required("Tagline can't be empty")
          .max(240, 'Must be at most 240 characters'),
        logo: string().required("Logo can't be empty"),
        category: array().of(
          object({
            label: string().required(),
            value: string().required(),
            colorScheme: string().required(),
          })
        ),
        twitter: string(),
        github: string().required("Project Github can't be empty"),
        projectLink: string().required("Project Link can't be empty"),
        telegram: string(),
        discord: string(),
        description: string().required(),
      })
    ),
    mode: 'onChange',
  });

  const goToNextStep = () => setStep(step + 1);

  const handleStepOneSubmit = (event: any) => {
    goToNextStep();
  };

  const goToPreviousStep = () => setStep(step - 1);

  const handleStepTwoSubmit = (data: any) => {
    goToNextStep();
  };

  const handleStepThreeSubmit = async (editorData: string) => {
    if (!session?.user) return;
    try {
      const imageUrl = await uploadToCloudinary(getValues('logo'));
      const projectSubmissionResponse = await createProjectMutation.mutateAsync(
        {
          id: uuidV4(),
          name: getValues().projectName,
          short_description: getValues().tagline,
          logo: imageUrl,
          long_description: editorData,
          industry: JSON.stringify(getValues().category),
          github: getValues().github,
          twitter: 'https://twitter.com/undefined',
          link: getValues().projectLink,
        }
      );
      setLoadingSubmit(false);
      router.push({
        pathname: '/projects/[projectId]',
        query: { projectId: projectSubmissionResponse.id },
      });
    } catch (e) {
      console.log('there was an error submitting form - ', e);
      setLoadingSubmit(false);
    }
  };

  const ProjectTimeline = ({
    index,
    name,
  }: {
    index: number;
    name: string;
  }) => {
    return (
      <HStack
        bg={
          step < index
            ? 'transparent'
            : step === index
            ? 'brand.teal2'
            : 'brand.teal4'
        }
        w="full"
        rounded="full"
        border="1px solid #FFFFFF10"
        py="0.5rem"
        px="0.8rem"
        align={'center'}
        justify="start"
      >
        <Center
          w="1.1rem"
          height="1.1rem"
          rounded="full"
          as="p"
          bg="white"
          color="black"
          backgroundColor={step < index ? 'neutral.7' : 'brand.teal6'}
          textStyle={'body5'}
        >
          {index}
        </Center>
        <Box
          as="p"
          textStyle={'body5'}
          color={step < index ? 'neutral.7' : 'brand.teal6'}
        >
          {name}
        </Box>
      </HStack>
    );
  };

  return (
    <Container maxW="full" p="0" my="10rem">
      <Card maxW="36rem" mx="auto">
        <CardHeader>
          <Box as="h1" textStyle={'title1'}>
            Create New Project
          </Box>
          <Box as="p" textStyle={'body4'} color="neutral.9">
            Bring your vision to life! Create a project, receive grants through
            public donations, and make an impact.
          </Box>
        </CardHeader>
        <HStack w="full" justify="space-between">
          <ProjectTimeline index={1} name={'Basic Information'} />
          <ProjectTimeline index={2} name={'Project Links'} />
          <ProjectTimeline index={3} name={'Detailed Info'} />
        </HStack>
        <form
          // @ts-ignore
          onSubmit={handleSubmit(onSubmit)}
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'start',
            gap: '2rem',
          }}
        >
          {step === 1 && (
            <StepOne
              onSubmit={handleStepOneSubmit}
              register={register}
              errors={errors}
              setValue={setValue}
              getValues={getValues}
              watch={watch}
              control={control}
            />
          )}
          {step === 2 && (
            <StepTwo
              onSubmit={handleStepTwoSubmit}
              register={register}
              onPrevious={goToPreviousStep}
              errors={errors}
            />
          )}
          {step === 3 && (
            <StepThree
              onPrevious={goToPreviousStep}
              onSubmit={handleStepThreeSubmit}
              setLoadingSubmit={setLoadingSubmit}
              LoadingSubmit={LoadingSubmit}
            />
          )}
        </form>
      </Card>
    </Container>
  );
};

export default SubmitProject;
