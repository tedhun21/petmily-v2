import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import useSWRMutation from 'swr/mutation';
import styled from 'styled-components';
import { toast } from 'react-toastify';

import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { poster } from 'api';
import GoogleOAuthButton from '@components/buttons/OAuthButton';
import Loading from '@components/Loading';
import { Center, Column, ErrorMessage } from 'styles/commonStyle';

import { AuthContext } from '@components/contexts/AuthProvider';
import { Button } from '@components/buttons/Button';
import { Input } from '@components/Input';

const schema = yup.object().shape({
  email: yup.string().email('이메일 형식을 지켜주세요.').required('ID는 필수입니다.'),
  password: yup
    .string()
    .min(8, '비밀번호는 8자리 이상이어야 합니다.')
    .matches(/^(?=.*[A-Za-z])(?=.*\d)/, '최소 1개의 영문자와 1개의 숫자를 반드시 포함해야 합니다. ')
    .required('비밀번호는 필수입니다.'),
});

type IFormLoginInputs = yup.InferType<typeof schema>;

export default function LoginPage() {
  const navigate = useNavigate();

  const { refreshToken } = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<IFormLoginInputs>({
    resolver: yupResolver(schema),
  });

  const { trigger, isMutating } = useSWRMutation('/auth/login', poster, {
    onSuccess: async () => {
      const access_token = await refreshToken();
      if (access_token) {
        navigate('/');
        toast.success('환영합니다!');
      }
    },
    onError: () => {
      toast.error('로그인에 실패헸습니다. 다시 시도해 주세요');
    },
  });

  // const [GuestLoginLoading, setGuestLoginLoading] = useState(false);

  const onSubmit = async (data: IFormLoginInputs) => {
    const { email, password } = data;

    await trigger(
      { email, password },
      {
        onError: (error: any) => {
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
        },
      },
    );
  };

  return (
    <Main as="main">
      <img src="/imgs/Logo.svg" alt="logo" width="150px" height="48px" />

      <FormContainer as="form" onSubmit={handleSubmit(onSubmit)}>
        <InputError>
          <Input
            type="email"
            placeholder="아이디"
            {...register('email', { required: true })}
            $fullWidth
            $size="md"
            $error={!!errors.email}
          />
          {errors?.email && <ErrorMessage>{errors.email?.message}</ErrorMessage>}
        </InputError>
        <InputError>
          <Input
            type="password"
            placeholder="비밀번호"
            {...register('password', { required: true })}
            $fullWidth
            $size="md"
            $error={!!errors.password}
          />
          {errors?.password && <ErrorMessage>{errors.password?.message}</ErrorMessage>}
        </InputError>

        <Button type="submit" disabled={isMutating} $variant="primary" $size="md" $fullWidth>
          {isMutating ? <Loading /> : '로 그 인'}
        </Button>

        <GoogleOAuthButton>Log in with Google</GoogleOAuthButton>
      </FormContainer>

      <div>
        <Center>
          <span>처음이신가요?</span>
          <CustomLink to="/signup">회원가입하기</CustomLink>
        </Center>
        <Center>
          <span>아이디를 잊으셨나요?</span>
          <CustomLink to="/login/find-id">아이디 찾기</CustomLink>
        </Center>
      </div>
    </Main>
  );
}

const Main = styled(Center)`
  flex-direction: column;
  height: 100%;
  gap: ${({ theme }) => theme.spacing._5xl};
`;

const FormContainer = styled(Column)`
  width: 100%;
  max-width: 360px;
  gap: ${({ theme }) => theme.spacing.md};
`;

const CustomLink = styled(Link)`
  color: ${({ theme }) => theme.colors.text.highlight};
  font-size: ${({ theme }) => theme.typeScale.sm};
  text-decoration-line: none;
`;

const InputError = styled(Column)`
  gap: ${({ theme }) => theme.spacing.xs};
`;
