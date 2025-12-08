import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useForm } from 'react-hook-form';
import useSWRMutation from 'swr/mutation';
import styled from '@emotion/styled';
import GoogleOAuthButton from '@/components/buttons/OAuthButton';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import CustomPortalModal from '@/components/CustomPortalModal';
import CustomDaumPostcode, { type PostcodeData } from '@/components/CustomDaumPostcode';
import { Button } from '@/components/styled/Button';
import { Input } from '@/components/styled/Input';
import { Text } from '@/components/styled/Text';
import Box from '@/components/styled/Box';
import Flex from '@/components/styled/Flex';
import { Divider } from '@/styles/commonStyle';
import { poster } from '@/api';
import { toast } from 'react-toastify';
import BackHeader from '@/components/headers/BackHeader';
import Loading from '@/components/Loading';

const schema = yup.object().shape({
  username: yup
    .string()
    .min(2, '이름은 2자 이상이어야 합니다.')
    .matches(/[가-힣]+/, '한글만 가능합니다.')
    .required('이름은 필수입니다.'),
  phone: yup
    .string()
    .matches(/^010[0-9]{8}$/, "010으로 시작해야 하며 '-'를 제외한 총 11자리 숫자여야 합니다.")
    .required('전화번호는 필수입니다.'),
  address: yup.string().required('주소는 필수입니다.'),
  detailAddress: yup.string().required('상세주소는 필수입니다.'),
  zipcode: yup.string().required('우편번호는 필수입니다.'),
  email: yup.string().email('이메일 형식을 지켜주세요.').required('Email은 필수입니다.'),
  nickname: yup
    .string()
    .min(2, '닉네임은 2자 이상부터 가능합니다.')
    .matches(/^[^!@#$%^&*()_+{}[\]:;<>,.?~|]+$/, '특수문자가 없어야 합니다.')
    .required('닉네임은 필수입니다.'),
  password: yup
    .string()
    .min(8, '비밀번호는 8자리 이상이어야 합니다.')
    .matches(/^(?=.*[A-Za-z])(?=.*\d)/, '최소 1개의 영문자와 1개의 숫자를 반드시 포함해야 합니다. ')
    .required('비밀번호는 필수입니다.'),
  passwordConfirm: yup
    .string()
    .required('비밀번호 확인은 필수입니다.')
    .oneOf([yup.ref('password')], '비밀번호가 서호 다릅니다.'),
  photo: yup.string().nullable().optional().default(null),
  isPetsitter: yup.boolean().default(false),
});
type IFormSignupInputs = yup.InferType<typeof schema>;

export default function SignupPage() {
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    register,
    getValues,
    setValue,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<IFormSignupInputs>({
    resolver: yupResolver(schema),
    defaultValues: {
      username: '',
      phone: '',
      address: '',
      detailAddress: '',
      zipcode: '',
      email: '',
      nickname: '',
      password: '',
      passwordConfirm: '',
      photo: null,
      isPetsitter: false,
    },
  });

  const { trigger, isMutating } = useSWRMutation('/users', poster, {
    onSuccess: () => {
      navigate('/login');
      toast.success('회원 가입을 완료했어요. 로그인 해주세요');
    },
    onError: () => {
      toast.error('회원 가입에 실패 했어요. 다시 시도해주세요.');
    },
  });

  const onToggleModal = () => {
    setIsModalOpen(true);
  };

  const handleComplete = (data: PostcodeData) => {
    if (data) {
      clearErrors('address');
    }
    const { address, zonecode } = data;

    setValue('address', address);
    setValue('zipcode', zonecode);

    setIsModalOpen(false);
  };

  const onSubmit = async (data: IFormSignupInputs) => {
    const { username, phone, address, detailAddress, email, nickname, password, passwordConfirm, isPetsitter } = data;

    if (password !== passwordConfirm) {
      setError('password', {
        type: 'dismatch',
        message: '비밀번호가 서로 다릅니다.',
      });
      setError('passwordConfirm', {
        type: 'dismatch',
        message: '비밀번호가 서로 다릅니다.',
      });

      return;
    }

    const createData = {
      username,
      phone,
      address,
      zipcode: getValues('zipcode'),
      detailAddress,
      email,
      nickname,
      password,
      role: isPetsitter ? 'Petsitter' : 'Client',
      provider: 'local',
      verified: false,
    };

    try {
      await trigger(createData);
    } catch (e: any) {
      if (e.response) {
        if (e.response.data.statusCode === 409) {
          if (e.response.data.field === 'email') {
            setError('email', {
              type: e.response.data.error,
              message: e.response.data.message,
            });
          }
          if (e.response.data.field === 'nickname') {
            setError('nickname', {
              type: e.response.data.error,
              message: e.response.data.message,
            });
          }
        }
      }
    }
  };

  return (
    <>
      <BackHeader />

      <main>
        <Flex direction="column" alignItems="center" gap="xl">
          <Text size="xl">We&apos;re Petmily!</Text>

          <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: '360px', width: '100%' }}>
            <Flex direction="column" gap="2xl">
              <Flex direction="column" gap="xs">
                <InputWrapper>
                  <Input
                    placeholder="이름"
                    type="text"
                    {...register('username', { required: true })}
                    error={errors.username ? true : undefined}
                    fullWidth
                  />
                  <div>
                    {errors.username?.message && (
                      <Text size="xs" color="error">
                        {errors.username?.message}
                      </Text>
                    )}
                  </div>
                </InputWrapper>
                <InputWrapper>
                  <Input
                    placeholder="연락처"
                    {...register('phone', { required: true })}
                    error={errors.phone ? true : undefined}
                    fullWidth
                  />
                  <div>
                    {errors.phone?.message && (
                      <Text size="xs" color="error">
                        {errors.phone?.message}
                      </Text>
                    )}
                  </div>
                </InputWrapper>
                <InputWrapper>
                  <Input
                    placeholder="주소"
                    {...register('address', { required: true })}
                    onClick={onToggleModal}
                    onKeyDown={onToggleModal}
                    error={errors.address ? true : undefined}
                    autoComplete="off"
                    fullWidth
                  />
                  <div>
                    {errors.address?.message && (
                      <Text size="xs" color="error">
                        {errors.address?.message}
                      </Text>
                    )}
                  </div>

                  {isModalOpen && (
                    <CustomPortalModal onClose={() => setIsModalOpen(false)}>
                      <CustomDaumPostcode width="400px" maxHeight={600} onComplete={handleComplete} />
                    </CustomPortalModal>
                  )}
                </InputWrapper>
                <InputWrapper>
                  <Input
                    placeholder="상세주소"
                    {...register('detailAddress', { required: true })}
                    error={errors.detailAddress ? true : undefined}
                    fullWidth
                  />
                  <div>
                    {errors.detailAddress?.message && (
                      <Text size="xs" color="error">
                        {errors.detailAddress?.message}
                      </Text>
                    )}
                  </div>
                </InputWrapper>
                <InputWrapper>
                  <Input
                    placeholder="이메일"
                    type="email"
                    {...register('email', { required: true })}
                    error={errors.email ? true : undefined}
                    fullWidth
                  />
                  <div>
                    {errors.email?.message && (
                      <Text size="xs" color="error">
                        {errors.email?.message}
                      </Text>
                    )}
                  </div>
                </InputWrapper>
                <InputWrapper>
                  <Input
                    placeholder="닉네임"
                    {...register('nickname', { required: true })}
                    error={errors.nickname ? true : undefined}
                    fullWidth
                  />
                  <div>
                    {errors.nickname?.message && (
                      <Text size="xs" color="error">
                        {errors.nickname?.message}
                      </Text>
                    )}
                  </div>
                </InputWrapper>
                <InputWrapper>
                  <Input
                    placeholder="비밀번호"
                    type="password"
                    {...register('password', { required: true })}
                    error={errors.password ? true : undefined}
                    fullWidth
                  />
                  <div>
                    {errors.password?.message && (
                      <Text size="xs" color="error">
                        {errors.password?.message}
                      </Text>
                    )}
                  </div>
                </InputWrapper>
                <InputWrapper>
                  <Input
                    placeholder="비밀번호 확인"
                    type="password"
                    {...register('passwordConfirm', { required: true })}
                    error={errors.passwordConfirm ? true : undefined}
                    fullWidth
                  />
                  <div>
                    {errors.passwordConfirm?.message && (
                      <Text size="xs" color="error">
                        {errors.passwordConfirm?.message}
                      </Text>
                    )}
                  </div>
                </InputWrapper>
                <Box>
                  <label htmlFor="isPetsitter">펫시터로 가입하기</label>
                  <input type="checkbox" id="isPetsitter" {...register('isPetsitter')} />
                </Box>
              </Flex>

              <Flex direction="column" gap="md">
                <Button type="submit" disabled={isMutating} variant="primary" size="md">
                  {isMutating ? <Loading /> : '펫밀리 등록'}
                </Button>

                <Flex alignItems="center" gap="sm">
                  <Divider />
                  <span>OR</span>
                  <Divider />
                </Flex>

                <div>
                  <GoogleOAuthButton>Sign up with Google</GoogleOAuthButton>
                </div>
              </Flex>
            </Flex>
          </form>
        </Flex>
      </main>
    </>
  );
}

// TODO
const InputWrapper = styled(Box)`
  > div {
    min-height: 18px;
  }
`;
