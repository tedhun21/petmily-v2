import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useForm } from 'react-hook-form';
import useSWRMutation from 'swr/mutation';
import styled from 'styled-components';
import GoogleOAuthButton from '@components/buttons/OAuthButton';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { Modal } from '@mui/material';
import { toast } from 'react-toastify';

import { poster } from 'api';
import Loading from '@components/Loading';
import BackHeader from '@components/headers/BackHeader';
import CustomDaumPostcode from '@components/CustomDaumPostcode';
import { Column, Row } from 'styles/commonStyle';
import { Button } from 'styles/common/Button';
import { Input } from 'styles/common/Input';
import { Text } from 'styles/common/Text';

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
  zipcode: yup.string(),
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
  passwordConfirm: yup.lazy(() => {
    return yup.string().oneOf([yup.ref('password'), ''], '비밀번호가 서로 다릅니다.');
  }),
  photo: yup.string(),
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
  } = useForm<IFormSignupInputs>({ resolver: yupResolver(schema) });

  const { trigger, isMutating } = useSWRMutation('/users', poster, {
    onSuccess: () => {
      navigate('/login');
      toast.success('회원 가입을 완료했습니다. 로그인 해주세요!');
    },
    onError: () => {
      toast.error('회원 가입에 실패 했습니다. 다시 시도해주세요.');
    },
  });

  const onToggleModal = () => {
    setIsModalOpen(true);
  };

  const handleComplete = (data: any) => {
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
      setError('password', { type: 'dismatch', message: '비밀번호가 서로 다릅니다.' });
      setError('passwordConfirm', { type: 'dismatch', message: '비밀번호가 서로 다릅니다.' });

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
            setError('email', { type: e.response.data.error, message: e.response.data.message });
          }
          if (e.response.data.field === 'nickname') {
            setError('nickname', { type: e.response.data.error, message: e.response.data.message });
          }
        }
      }
    }
  };

  return (
    <>
      <BackHeader />

      <Main>
        <SignupContainer>
          <TitleContainer>
            <Text $size="xl">We&apos;re Petmily!</Text>
            <Text>회원가입</Text>
          </TitleContainer>

          <form onSubmit={handleSubmit(onSubmit)}>
            <InputContainer>
              <InputWrapper>
                <Input
                  placeholder="이름"
                  type="text"
                  {...register('username', { required: true })}
                  $error={errors.username ? true : undefined}
                />
                {errors.username?.message && (
                  <Text $size="xs" $color="error">
                    {errors.username?.message}
                  </Text>
                )}
              </InputWrapper>
              <InputWrapper>
                <Input
                  placeholder="연락처"
                  {...register('phone', { required: true })}
                  $error={errors.phone ? true : undefined}
                />
                {errors.phone?.message && (
                  <Text $size="xs" $color="error">
                    {errors.phone?.message}
                  </Text>
                )}
              </InputWrapper>
              <InputWrapper>
                <Input
                  placeholder="주소"
                  {...register('address', { required: true })}
                  onClick={onToggleModal}
                  onKeyDown={onToggleModal}
                  $error={errors.address ? true : undefined}
                  autoComplete="off"
                />
                {errors.address?.message && (
                  <Text $size="xs" $color="error">
                    {errors.address?.message}
                  </Text>
                )}

                <Modal
                  open={isModalOpen}
                  onClose={() => setIsModalOpen(false)}
                  sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                >
                  <div style={{ width: '360px' }}>
                    <CustomDaumPostcode onComplete={handleComplete} />
                  </div>
                </Modal>
              </InputWrapper>
              <InputWrapper>
                <Input
                  placeholder="상세주소"
                  {...register('detailAddress', { required: true })}
                  $error={errors.detailAddress ? true : undefined}
                />
                {errors.detailAddress?.message && (
                  <Text $size="xs" $color="error">
                    {errors.detailAddress?.message}
                  </Text>
                )}
              </InputWrapper>
              <InputWrapper>
                <Input
                  placeholder="이메일"
                  type="email"
                  {...register('email', { required: true })}
                  $error={errors.email ? true : undefined}
                />
                {errors.email?.message && (
                  <Text $size="xs" $color="error">
                    {errors.email?.message}
                  </Text>
                )}
              </InputWrapper>
              <InputWrapper>
                <Input
                  placeholder="닉네임"
                  {...register('nickname', { required: true })}
                  $error={errors.nickname ? true : undefined}
                />
                {errors.nickname?.message && (
                  <Text $size="xs" $color="error">
                    {errors.nickname?.message}
                  </Text>
                )}
              </InputWrapper>
              <InputWrapper>
                <Input
                  placeholder="비밀번호"
                  type="password"
                  {...register('password', { required: true })}
                  $error={errors.password ? true : undefined}
                />
                {errors.password?.message && (
                  <Text $size="xs" $color="error">
                    {errors.password?.message}
                  </Text>
                )}
              </InputWrapper>
              <InputWrapper>
                <Input
                  placeholder="비밀번호 확인"
                  type="password"
                  {...register('passwordConfirm', { required: true })}
                  $error={errors.passwordConfirm ? true : undefined}
                />
                {errors.passwordConfirm?.message && (
                  <Text $size="xs" $color="error">
                    {errors.passwordConfirm?.message}
                  </Text>
                )}
              </InputWrapper>
              <CheckBoxWrapper>
                <CheckBoxLabel htmlFor="isPetsitter">펫시터로 가입하기</CheckBoxLabel>
                <input type="checkbox" id="isPetsitter" {...register('isPetsitter')} />
              </CheckBoxWrapper>
              <ButtonContainer>
                <Button type="submit" disabled={isMutating} $variant="primary" $size="lg" $borderRadius="lg">
                  {isMutating ? <Loading /> : '펫밀리 등록'}
                </Button>
                <GoogleOAuthButton $size="lg" $borderRadius="lg">
                  Sign up with Google
                </GoogleOAuthButton>
              </ButtonContainer>
            </InputContainer>
          </form>
        </SignupContainer>
      </Main>
    </>
  );
}

const Main = styled.main`
  flex: 1;
`;

const SignupContainer = styled.div`
  width: 100%;
  height: 100%;
`;

const TitleContainer = styled(Column)`
  text-align: left;
`;

const InputContainer = styled(Column)`
  padding: ${({ theme }) => theme.spacing._5xl};
  gap: ${({ theme }) => theme.spacing.lg};
`;

const InputWrapper = styled(Column)`
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ButtonContainer = styled(Column)`
  gap: ${({ theme }) => theme.spacing.lg};
`;

const CheckBoxWrapper = styled(Row)`
  padding-left: ${({ theme }) => theme.spacing.xs};
  gap: ${({ theme }) => theme.spacing.sm};
`;

const CheckBoxLabel = styled.label`
  color: ${({ theme }) => theme.colors.text.secondary};
  ${({ theme }) => theme.typeScale.sm};
`;
