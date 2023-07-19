import {
  Alert,
  AlertDescription,
  AlertIcon,
  Avatar,
  Box,
  Button,
  Center,
  Checkbox,
  Collapse,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Skeleton,
  Spinner,
  Stack,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { Round } from '@cubik/database';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import React, { useState } from 'react';
import RoundStatus from '~/components/common/dates/Status';
import ComponentErrors from '~/components/errors/ComponentErrors';
import { RoundDetailsWithProjectsWithContributionsType } from '~/types/round';
import SelectProjectToApplyForGrant from '../SelectProjectToApplyForGrant';
import { BiPlus } from 'react-icons/bi';
import { WalletAddress } from '~/components/common/wallet/WalletAdd';
import { publicKey } from '@coral-xyz/anchor/dist/cjs/utils';
import { disconnect } from 'process';
import { FailureToast } from '~/components/common/toasts/Toasts';
import { Controller, useForm } from 'react-hook-form';
import { HiCheck } from 'react-icons/hi';
import FramerCarousel from '../../create-profile/FramerNFTCarousel';
import ProfilePicture from '../../create-profile/ProfilePicture';
import UploadImageInput from '~/components/common/inputs/UploadImageInput';
import { AmountInput } from '../../projects/project-details/project-interactions/project-donation-simulator/form/DonationAmountInput';
import { tokens } from '~/components/common/tokens/DonationTokens';

const sponsors = [
  {
    name: 'Solana Foundation',
    logo: 'https://media.licdn.com/dms/image/C4E0BAQHcCejfzCYGDg/company-logo_200_200/0/1641233667655?e=2147483647&v=beta&t=oDXuW9JIKNPt5T_g9ABUJ-osc4DJZh88HNSkX9Nkmfg',
    amount: 10000,
    link: 'https://solana.com/',
  },
  {
    name: 'Symmetry',
    logo: 'https://pbs.twimg.com/profile_images/1650368880454377472/CaLpt63o_400x400.jpg',
    amount: 10000,
    link: 'https://solana.com/',
  },
  {
    name: 'Superteam DAO',
    logo: 'https://pbs.twimg.com/profile_images/1679100194028392448/4_3L1nRh_400x400.jpg',
    amount: 10000,
    link: 'https://solana.com/',
  },
  {
    name: 'Squads',
    logo: 'https://avatars.githubusercontent.com/u/84348534?s=200&v=4',
    amount: 10000,
    link: 'https://solana.com/',
  },
];

const GrantSponsors = ({
  grantName,
  grantId,
  isLoading,
}: {
  grantName: string | undefined | null;
  grantId: string | undefined | null;
  isLoading: boolean;
}) => {
  const {
    handleSubmit,
    trigger,
    control,
    clearErrors,
    setValue,
    getValues,
    setError,
    register,
    formState: { errors },
  } = useForm({});

  const { isOpen, onClose, onOpen } = useDisclosure();
  const onSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <>
      <HStack
        flexWrap={'wrap'}
        gap={{
          sm: '0',
          md: '12px',
        }}
      >
        <HStack
          cursor={'pointer'}
          onClick={onOpen}
          rounded="full"
          backgroundColor={'neutral.4'}
          p={['6px', '6px', '8px']}
          spacing={['12px', '14px', '16px']}
          pe={['12px', '16px', '24px']}
        >
          <Center
            rounded="full"
            bg="neutral.6"
            width={[6, 8, 10]}
            height={[6, 8, 10]}
          >
            <Box as={BiPlus} boxSize={[18, 18, 22]} color="#fff" />
          </Center>
          <Box
            as="p"
            textStyle={{ base: 'title5', md: 'title4' }}
            color="neutral.11"
          >
            Become a Sponsor
          </Box>
        </HStack>
        {sponsors.map((sponsor) => (
          <React.Fragment key={sponsor.name}>
            <Skeleton
              isLoaded={!isLoading}
              fadeDuration={2.5}
              opacity={isLoading ? '0.4' : '1'}
              rounded="full"
            >
              <HStack
                rounded="full"
                backgroundColor={'neutral.4'}
                p={['6px', '6px', '8px']}
                spacing={['12px', '14px', '16px']}
                pe={['12px', '16px', '24px']}
              >
                <Avatar
                  width={[6, 8, 10]}
                  height={[6, 8, 10]}
                  src={sponsor.logo}
                  name={sponsor.name}
                />
                <Box
                  as="p"
                  textStyle={{ base: 'title5', md: 'title4' }}
                  color="neutral.11"
                >
                  {sponsor.name}
                </Box>
              </HStack>
            </Skeleton>
          </React.Fragment>
        ))}
      </HStack>
      <Modal variant="cubik" size="xl" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <HStack>
              <Box
                as="p"
                textStyle={{ base: 'title3', md: 'title2' }}
                color="neutral.11"
              >
                Sponsor Grant Round
              </Box>
            </HStack>
          </ModalHeader>
          <ModalBody>
            <form
              style={{
                gap: '32px',
                display: 'flex',
                flexDirection: 'column',
              }}
              onSubmit={handleSubmit(onSubmit)}
            >
              <FormControl
                variant={'outline'}
                colorScheme={'pink'}
                isInvalid={!!errors.name}
                isRequired
              >
                <FormLabel fontSize={{ base: 'xs', md: 'sm' }} htmlFor="name">
                  Name
                </FormLabel>

                <InputGroup>
                  <Controller
                    name="name"
                    control={control}
                    rules={{
                      required: true,
                    }}
                    render={({
                      field: { onChange, ...field },
                    }: {
                      field: any;
                    }) => (
                      <Input
                        {...field}
                        autoComplete="false"
                        placeholder="Sponsor Organization Name"
                        aria-autocomplete="none"
                      />
                    )}
                  />
                </InputGroup>
                {errors.Name ? (
                  <>
                    <FormErrorMessage textAlign={'start'}>
                      {errors.Name && <>{errors.Name.message}</>}
                    </FormErrorMessage>
                  </>
                ) : (
                  <>
                    {/* <FormHelperText
                      fontSize={{ base: '12px', md: '14px' }}
                      color="neutral.6"
                    >
                      Username can&apos;t be changed.
                    </FormHelperText> */}
                  </>
                )}
              </FormControl>
              <FormControl
                variant={'outline'}
                colorScheme={'pink'}
                isInvalid={!!errors.name}
                isRequired
              >
                <FormLabel fontSize={{ base: 'xs', md: 'sm' }} htmlFor="logo">
                  Logo
                </FormLabel>
                <UploadImageInput
                  setValue={setValue}
                  setError={setError}
                  getValues={getValues}
                  errors={errors}
                />
                {errors.Name ? (
                  <>
                    <FormErrorMessage textAlign={'start'}>
                      {errors.Name && <>{errors.Name.message}</>}
                    </FormErrorMessage>
                  </>
                ) : (
                  <>
                    {/* <FormHelperText
                      fontSize={{ base: '12px', md: '14px' }}
                      color="neutral.6"
                    >
                      Username can&apos;t be changed.
                    </FormHelperText> */}
                  </>
                )}
              </FormControl>
              <FormControl isRequired>
                <FormLabel
                  fontSize={{ base: 'xs', md: 'sm' }}
                  htmlFor="publickey"
                >
                  Amount
                </FormLabel>
                <HStack>
                  <AmountInput
                    value={100}
                    setValue={() => {}}
                    register={register}
                    errors={errors}
                    token={tokens}
                    control={control}
                  />
                </HStack>
                {errors.amount ? (
                  <>
                    <FormErrorMessage textAlign={'start'}>
                      {errors.Name && <>{errors.Name.message}</>}
                    </FormErrorMessage>
                  </>
                ) : (
                  <>
                    <FormHelperText
                      fontSize={{ base: '12px', md: '14px' }}
                      color="neutral.6"
                    >
                      Minimum amount is $500.
                    </FormHelperText>
                  </>
                )}
              </FormControl>
              <FormControl
                display="flex"
                flexDirection="row"
                alignContent="center"
                justifyItems="start"
                gap="12px"
              >
                <Controller
                  name="public"
                  control={control}
                  render={({ field: { ref, ...rest } }) => (
                    <Checkbox size="lg" colorScheme={'teal'} value="public" />
                  )}
                />
                <Box as="p" textStyle="body4" color="neutral.9">
                  Make Sponsorship Visible on Grants Page
                </Box>
              </FormControl>
              <HStack
                p="0"
                pt={{ base: '24px', md: '56px' }}
                w="full"
                align={'start'}
                justify="space-between"
                gap={{ base: '8px', md: '18px' }}
              >
                {' '}
                <Button
                  w="10rem"
                  size={{ base: 'cubikMini', md: 'cubikSmall' }}
                  variant="cubikOutlined"
                  color="neutral.7"
                  outlineColor="neutral.7"
                >
                  Cancel
                </Button>
                <Button
                  w="12rem"
                  size={{ base: 'cubikMini', md: 'cubikSmall' }}
                  variant="cubikFilled"
                  loadingText="Submitting"
                  type="submit"
                >
                  Sign Transaction
                </Button>
                {/* <Alert status="info" variant="cubik">
                  <AlertIcon />
                  <AlertDescription
                    fontSize={{ base: '10px', md: '11px', xl: '12px' }}
                    lineHeight={{ base: '14px', md: '14px', xl: '16px' }}
                  >
                    By clicking submit, you&apos;ll initiate a profile creation
                    transaction from connected wallet. Ensure you have enough
                    SOL to sign the transaction.
                  </AlertDescription>
                </Alert> */}
              </HStack>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

const GrantDetailsHeader = ({
  data,
  isLoading,
  isError,
  error,
}: {
  data: RoundDetailsWithProjectsWithContributionsType | undefined | null;
  isLoading: boolean;
  isError: boolean;
  error?: any;
}) => {
  const walletModal = useWalletModal();
  const wallet = useWallet();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedGrantRound, setSelectedGrantRound] = useState<Round | null>(
    null
  );
  const handleApplyForGrant = () => {
    if (!wallet.publicKey?.toBase58()) return walletModal.setVisible(true);
    onOpen();
  };

  if (isError) {
    return (
      <Center
        w="full"
        py={{ base: '16px', sm: '24px' }}
        border="1px dashed"
        borderColor={'#1D1F1E'}
        rounded="12px"
      >
        <ComponentErrors error={error?.message} />
      </Center>
    );
  }
  return (
    <VStack w="full" align={'start'} gap={{ base: '28px', md: '40px' }}>
      <VStack w="full" align={'start'} gap={{ base: '8px', md: '8px' }}>
        <VStack align={'start'} spacing={{ base: '12px', md: '24px' }}>
          <Skeleton
            isLoaded={!isLoading}
            fadeDuration={0.5}
            opacity={isLoading ? '0.5' : '1'}
            rounded="full"
          >
            <RoundStatus
              show={true}
              startDate={data?.startTime}
              endDate={data?.endTime}
            />
          </Skeleton>
          <VStack align={'start'} spacing={{ base: '12px', md: '24px' }}>
            <Skeleton
              isLoaded={!isLoading}
              fadeDuration={2}
              opacity={isLoading ? '0.6' : '1'}
            >
              <Box
                as="p"
                textStyle={{ base: 'display5', md: 'display3' }}
                color={'neutral.11'}
              >
                {data?.roundName}
              </Box>
            </Skeleton>
            <Skeleton
              isLoaded={!isLoading}
              fadeDuration={1.5}
              opacity={isLoading ? '0.6' : '1'}
            >
              <Box
                as="p"
                textStyle={{ base: 'body2', md: 'body1' }}
                color={'neutral.9'}
              >
                {data?.short_description}
              </Box>
            </Skeleton>
          </VStack>
        </VStack>
        <Stack
          justify={'space-between'}
          align={{ base: 'center', md: 'end' }}
          direction={{ base: 'row', md: 'row' }}
          spacing={{ base: '12px', md: '24px' }}
          w="full"
        >
          <Stack
            w={{ base: 'full', md: 'auto' }}
            align={{ base: 'start', md: 'center' }}
            flexDir={{ base: 'column', md: 'row' }}
            pt="12px"
            pb={{ base: '12px', md: '0px' }}
            gap={{ base: '0px', md: '24px' }}
          >
            <Skeleton
              isLoaded={!isLoading}
              fadeDuration={2}
              opacity={isLoading ? '0.4' : '1'}
            >
              <Stack
                direction={{ base: 'row', md: 'row' }}
                spacing="4px"
                align={'baseline'}
              >
                <HStack gap="4px" align="center" justify="start">
                  <Center
                    w="10px"
                    h="10px"
                    backgroundColor="surface.green.2"
                    rounded="full"
                  />
                  <Box
                    as="p"
                    textStyle={{ base: 'title5', md: 'title4' }}
                    color={'neutral.11'}
                  >
                    ${data?.matchedPool}
                  </Box>
                </HStack>
                <Box
                  as="p"
                  textStyle={{ base: 'overline4', md: 'overline3' }}
                  color={'neutral.11'}
                >
                  Matching Pool
                </Box>
              </Stack>
            </Skeleton>
            <Skeleton
              isLoaded={!isLoading}
              fadeDuration={2}
              opacity={isLoading ? '0.4' : '1'}
            >
              <HStack gap="4px" align="center" justify="start">
                <Center
                  w="10px"
                  h="10px"
                  backgroundColor="surface.teal.2"
                  rounded="full"
                />
                <HStack spacing="4px" align={'baseline'}>
                  <Box
                    as="p"
                    textStyle={{ base: 'title5', md: 'title4' }}
                    color={'neutral.8'}
                  >
                    {data?.ProjectJoinRound.filter(
                      (e) => e.status === 'APPROVED'
                    ).length ?? 0}
                  </Box>
                  <Box
                    as="p"
                    textStyle={{ base: 'overline4', md: 'overline3' }}
                    color={'neutral.8'}
                  >
                    Projects Participating
                  </Box>
                </HStack>
              </HStack>
            </Skeleton>
          </Stack>
          {/* <Skeleton
            isLoaded={!isLoading}
            fadeDuration={2.5}
            opacity={isLoading ? '0.4' : '1'}
          >
            <Button
              // display={
              //   checkRoundStatus(
              //     data?.startTime as Date,
              //     data?.endTime as Date
              //   ) === GRANT_STATUS.notStarted
              //     ? 'block'
              //     : 'none'
              // }
              variant={'cubikFilled'}
              size={{ base: 'cubikSmall', md: 'cubikMedium' }}
              onClick={() => {
                setSelectedGrantRound(data as Round);
                handleApplyForGrant();
              }}
            >
              Apply For Grants
            </Button>
          </Skeleton> */}
        </Stack>
      </VStack>
      <VStack spacing="16px" align="start">
        <Skeleton
          isLoaded={!isLoading}
          fadeDuration={2.5}
          opacity={isLoading ? '0.3' : '1'}
        >
          <Box
            as="p"
            textStyle={{ base: 'overline4', md: 'overline2' }}
            color={'neutral.11'}
          >
            Grant Sponsors
          </Box>
        </Skeleton>
        <GrantSponsors
          isLoading={false}
          grantName={data?.roundName}
          grantId={data?.id}
        />
      </VStack>
      <SelectProjectToApplyForGrant
        isOpen={isOpen}
        onClose={onClose}
        selectedGrantRound={selectedGrantRound}
      />
    </VStack>
  );
};

export default GrantDetailsHeader;
