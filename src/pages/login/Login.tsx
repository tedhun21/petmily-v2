import { Link, useNavigate } from 'react-router-dom';

import useSWRMutation from 'swr/mutation';
import styled from 'styled-components';

import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { poster } from 'api';
import { setCookie } from 'utils/cookie';
import GoogleOAuthButton from '@components/buttons/OAuthButton';
import Loading from '@components/Loading';
import { Column, ErrorMessage } from 'commonStyle';
import { toast } from 'react-toastify';

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

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<IFormLoginInputs>({
    resolver: yupResolver(schema),
  });

  const { trigger, isMutating } = useSWRMutation(`${API_URL}/auth/login`, poster, {
    onSuccess: (data) => {
      setCookie('access_token', data.access_token);
      navigate('/');
      toast.success('환영합니다!');
    },
    onError: () => {
      toast.error('로그인에 실패헸습니다. 다시 시도해 주세요');
    },
  });

  // const [GuestLoginLoading, setGuestLoginLoading] = useState(false);

  const onSubmit = async (data: IFormLoginInputs) => {
    const { email, password } = data;

    try {
      await trigger({ email, password }); // await를 사용하여 에러 처리
    } catch (error: any) {
      // 에러 처리
      if (error.response) {
        // not found
        if (error.response.data.statusCode === 404) {
          setError('email', { type: error.response.data.error, message: error.response.data.message });
        }
        // unauthorized
        if (error.response.data.statusCode === 401) {
          setError('password', { type: error.response.data.error, message: error.response.data.message });
        }
      }
    }
  };

  return (
    <MainContainer>
      <img src="/imgs/Logo.svg" alt="logo" width="150px" height="48px" />
      <LoginContainer>
        <FormContainer onSubmit={handleSubmit(onSubmit)}>
          <InputError>
            <LoginInput type="email" placeholder="아이디" {...register('email', { required: true })} />
            {errors?.email && <ErrorMessage>{errors.email?.message}</ErrorMessage>}
          </InputError>
          <InputError>
            <LoginInput type="password" placeholder="비밀번호" {...register('password', { required: true })} />
            {errors?.password && <ErrorMessage>{errors.password?.message}</ErrorMessage>}
          </InputError>
          <div>
            <SubmitButton type="submit" disabled={isMutating}>
              {isMutating ? <Loading /> : '로 그 인'}
            </SubmitButton>
          </div>
          <GoogleOAuthButton>Log in with Google</GoogleOAuthButton>
        </FormContainer>
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

const FormContainer = styled.form`
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
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 8px;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.colors.mainBlue};
  border: none;
  color: white;

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

const InputError = styled(Column)`
  gap: 4px;
`;
