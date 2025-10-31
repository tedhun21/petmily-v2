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
import { SubmitButton } from '@pages/login/page';
import BackHeader from '@components/headers/BackHeader';
import CustomDaumPostcode from '@components/CustomDaumPostcode';
import { Column, ErrorMessage, Input, Texts16h24, Texts20h28 } from 'styles/commonStyle';

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
            <Texts20h28>We&apos;re Petmily!</Texts20h28>
            <Texts16h24>회원가입</Texts16h24>
          </TitleContainer>
          <InputFormContainer onSubmit={handleSubmit(onSubmit)}>
            <InputFormWrapper>
              <SignupInputStyle
                placeholder="이름"
                type="text"
                {...register('username', { required: true })}
                error={errors.username ? true : undefined}
              />
              {errors.username?.message && <ErrorMessage>{errors.username?.message}</ErrorMessage>}
            </InputFormWrapper>
            <InputFormWrapper>
              <SignupInputStyle
                placeholder="연락처"
                {...register('phone', { required: true })}
                error={errors.phone ? true : undefined}
              />
              {errors.phone?.message && <ErrorMessage>{errors.phone?.message}</ErrorMessage>}
            </InputFormWrapper>
            <InputFormWrapper>
              <SignupInputStyle
                placeholder="주소"
                {...register('address', { required: true })}
                onClick={onToggleModal}
                onKeyDown={onToggleModal}
                error={errors.address ? true : undefined}
                autoComplete="off"
              />
              {errors.address?.message && <ErrorMessage>{errors.address?.message}</ErrorMessage>}

              <Modal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
              >
                <div style={{ width: '360px' }}>
                  <CustomDaumPostcode onComplete={handleComplete} />
                </div>
              </Modal>
            </InputFormWrapper>
            <InputFormWrapper>
              <SignupInputStyle
                placeholder="상세주소"
                {...register('detailAddress', { required: true })}
                error={errors.detailAddress ? true : undefined}
              />
              {errors.detailAddress?.message && <ErrorMessage>{errors.detailAddress?.message}</ErrorMessage>}
            </InputFormWrapper>
            <InputFormWrapper>
              <SignupInputStyle
                placeholder="이메일"
                type="email"
                {...register('email', { required: true })}
                error={errors.email ? true : undefined}
              />
              {errors.email?.message && <ErrorMessage>{errors.email?.message}</ErrorMessage>}
            </InputFormWrapper>
            <InputFormWrapper>
              <SignupInputStyle
                placeholder="닉네임"
                {...register('nickname', { required: true })}
                error={errors.nickname ? true : undefined}
              />
              {errors.nickname?.message && <ErrorMessage>{errors.nickname?.message}</ErrorMessage>}
            </InputFormWrapper>
            <InputFormWrapper>
              <SignupInputStyle
                placeholder="비밀번호"
                type="password"
                {...register('password', { required: true })}
                error={errors.password ? true : undefined}
              />
              {errors.password?.message && <ErrorMessage>{errors.password?.message}</ErrorMessage>}
            </InputFormWrapper>
            <InputFormWrapper>
              <SignupInputStyle
                placeholder="비밀번호 확인"
                type="password"
                {...register('passwordConfirm', { required: true })}
                error={errors.passwordConfirm ? true : undefined}
              />
              {errors.passwordConfirm?.message && <ErrorMessage>{errors.passwordConfirm?.message}</ErrorMessage>}
            </InputFormWrapper>
            <CheckBoxWrapper>
              <CheckBoxLabel htmlFor="isPetsitter">펫시터로 가입하기</CheckBoxLabel>
              <input type="checkbox" id="isPetsitter" {...register('isPetsitter')} />
            </CheckBoxWrapper>
            <ButtonContainer>
              <SubmitButton type="submit" disabled={isMutating}>
                {isMutating ? <Loading /> : '펫밀리 등록'}
              </SubmitButton>
              <GoogleOAuthButton>Sign up with Google</GoogleOAuthButton>
            </ButtonContainer>
          </InputFormContainer>
        </SignupContainer>
      </Main>
    </>
  );
}

const Main = styled.main`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const SignupContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
  width: 100%;
  max-width: 360px;
`;

const TitleContainer = styled(Column)`
  text-align: left;
`;

const InputFormContainer = styled.form`
  display: flex;
  flex-direction: column;
  margin-top: 36px;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const InputFormWrapper = styled.div``;

const SignupInputStyle = styled(Input)<{ error?: boolean }>`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme, error }) => (error ? theme.colors.line.input.error : theme.colors.line.input.primary)};
  border-radius: ${({ theme }) => theme.radius.md};
  ${({ theme }) => theme.typeScale.sm};

  &:focus {
    border: 1px solid ${({ theme }) => theme.colors.line.input.highlight};
  }
`;

const ButtonContainer = styled(Column)`
  gap: ${({ theme }) => theme.spacing.lg};
`;
const CheckBoxWrapper = styled.div`
  display: flex;
  padding-left: ${({ theme }) => theme.spacing.xs};
  gap: ${({ theme }) => theme.spacing.sm};
`;

const CheckBoxLabel = styled.label`
  ${({ theme }) => theme.typeScale.sm}
  color:${({ theme }) => theme.colors.text.secondary}
`;
