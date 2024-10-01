import { Link, useNavigate } from 'react-router-dom';

import useSWRMutation from 'swr/mutation';
import styled, { keyframes } from 'styled-components';

import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { poster } from 'api';
import { setCookie } from 'utils/cookie';
import GoogleOAuthButton from '@components/buttons/OAuthButton';

const schema = yup.object().shape({
  email: yup.string().email('이메일 형식을 지켜주세요.').required('ID는 필수입니다.'),
  password: yup
    .string()
    .min(8, '비밀번호는 8자리 이상이어야 합니다.')
    .matches(/^(?=.*[A-Za-z])(?=.*\d)/, '최소 1개의 영문자와 1개의 숫자를 반드시 포함해야 합니다. ')
    .required('비밀번호는 필수입니다.'),
});
type IFormLoginInputs = yup.InferType<typeof schema>;

const API_URL = process.env.REACT_APP_API_URL;

export default function Login() {
  const navigate = useNavigate();

  const { trigger, isMutating } = useSWRMutation(`${API_URL}/auth/login`, poster, {
    onSuccess: (data) => {
      setCookie(data.access_token);
      navigate('/');
    },
    onError: () => {
      window.alert('로그인에 실패헸습니다. 다시 시도해 주세요');
    },
  });

  // const [GuestLoginLoading, setGuestLoginLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormLoginInputs>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: IFormLoginInputs) => {
    const { email, password } = data;
    await trigger({ email, password });
  };

  return (
    <MainContainer>
      <img src="/imgs/Logo.svg" alt="logo" width="150px" height="48px" />
      <LoginContainer>
        <InputFormContainer onSubmit={handleSubmit(onSubmit)}>
          <div>
            <LoginInput type="email" placeholder="아이디" {...register('email', { required: true })} />
            {errors.email?.message && <ErrorMessage>{errors.email?.message}</ErrorMessage>}
          </div>
          <div>
            <LoginInput type="password" placeholder="비밀번호" {...register('password', { required: true })} />
            {errors.password?.message && <ErrorMessage>{errors.password?.message}</ErrorMessage>}
          </div>
          <div style={{ position: 'relative' }}>
            <SubmitButton type="submit" disabled={isMutating}>
              {isMutating && (
                <LoadingContainer>
                  <Spinner />
                </LoadingContainer>
              )}
              로 그 인
            </SubmitButton>
            {/* <SubmitButtonStyle type="button" onClick={handleGuestLogin} disabled={GuestLoginLoading}>
              {GuestLoginLoading && (
                <LoadingContainer>
                  <Spinner />
                </LoadingContainer>
              )}
              Guest 로 그 인
            </SubmitButtonStyle> */}
          </div>
          <GoogleOAuthButton>Log in with Google</GoogleOAuthButton>
        </InputFormContainer>
        <CustomLink to="/signup">회원가입하기</CustomLink>
      </LoginContainer>
    </MainContainer>
  );
}

const MainContainer = styled.main`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 80%;
  background-color: white;
  gap: 60px;
`;

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 360px;
`;

const InputFormContainer = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  gap: 12px;
`;

const LoginInput = styled.input`
  width: 100%;
  height: 32px;
  padding: 16px 8px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.mainBlue};
  ${({ theme }) => theme.fontSize.s14h21};

  &:hover {
    border: 1px solid ${({ theme }) => theme.colors.darkBlue};
  }
`;

export const SubmitButton = styled.button`
  //
  position: relative;
  //

  margin-top: 12px;
  height: 32px;
  width: 100%;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.mainBlue};
  border: none;
  color: white;
  cursor: pointer;

  ${({ theme }) => theme.fontSize.s16h24};
  font-weight: ${({ theme }) => theme.fontWeights.bold};

  &:hover {
    background-color: ${({ theme }) => theme.colors.subBlue};
  }

  &:active {
    background-color: ${({ theme }) => theme.colors.darkBlue};
    box-shadow: ${({ theme }) => theme.shadow.inset};
  }
`;

const CustomLink = styled(Link)`
  margin-top: 12px;
  color: ${({ theme }) => theme.colors.mainBlue};
  font-size: ${({ theme }) => theme.fontSize.s14h21};
  text-decoration-line: none;
`;

export const ErrorMessage = styled.p`
  margin-top: 4px;
  padding-left: 4px;
  color: ${({ theme }) => theme.colors.paleBlue};
  font-size: 12px;
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 18px;
  height: 18px;
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Spinner = styled.div`
  width: 100%;
  height: 100%;
  border: 2px solid rgb(255 255 255 / 60%);
  border-radius: 50%;
  animation: ${spin} 1.2s linear infinite;
  border-top: 2px solid #fff;
`;
