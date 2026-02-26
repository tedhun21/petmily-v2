import { useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import useSWRMutation from 'swr/mutation';
import styled from '@emotion/styled';
import GoogleOAuthButton from '@/components/buttons/OAuthButton';
import { toast } from 'react-toastify';
import { isAxiosError } from 'axios';

import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import CustomDaumPostcode, { type PostcodeData } from '@/components/CustomDaumPostcode';
import Button from '@/components/styled/Button';
import { Input } from '@/components/styled/Input';
import Text from '@/components/styled/Text';
import Box from '@/components/styled/Box';
import Flex from '@/components/styled/Flex';
import { Divider } from '@/styles/commonStyle';
import { poster } from '@/api';
import Spinner from '@/components/Spinner';
import Header from '@/components/headers/Header';

import Modal from '@/components/Modal';

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

  const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);

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

  const handleComplete = (data: PostcodeData) => {
    if (data) {
      clearErrors('address');
    }

    const { address, zonecode } = data;

    setValue('address', address);
    setValue('zipcode', zonecode);

    setIsPostcodeOpen(false);
  };

  const onSubmit = async (data: IFormSignupInputs) => {
    const { isPetsitter } = data;

    const createData = {
      ...data,
      zipcode: getValues('zipcode'),
      role: isPetsitter ? 'petsitter' : 'client',
      provider: 'local',
      verified: false,
    };

    try {
      await trigger(createData);
    } catch (e) {
      if (isAxiosError(e)) {
        const response = e.response;

        if (response) {
          const { statusCode, message, field } = response.data;

          if (statusCode === 409) {
            if (field === 'email' || field === 'nickname') {
              setError(field, {
                type: 'manual',
                message: message,
              });
            }
          }
        }
      }
    }
  };

  return (
    <>
      <Header />

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
                  <Modal isOpen={isPostcodeOpen} setIsOpen={setIsPostcodeOpen}>
                    <Modal.Trigger>
                      <Input
                        placeholder="주소"
                        {...register('address', { required: true })}
                        error={errors.address ? true : undefined}
                        autoComplete="off"
                        fullWidth
                      />
                    </Modal.Trigger>
                    <Modal.Content>
                      <CustomDaumPostcode onComplete={handleComplete} />
                    </Modal.Content>
                  </Modal>
                  <div>
                    {errors.address?.message && (
                      <Text size="xs" color="error">
                        {errors.address?.message}
                      </Text>
                    )}
                  </div>
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
                  {isMutating ? <Spinner /> : '펫밀리 등록'}
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

const InputWrapper = styled(Box)`
  > div {
    min-height: 18px;
  }
`;
