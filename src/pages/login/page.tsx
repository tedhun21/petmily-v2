import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import useSWRMutation from 'swr/mutation';
import styled from 'styled-components';
import { toast } from 'react-toastify';

import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { poster } from 'api';
import GoogleOAuthButton from '@components/buttons/OAuthButton';
import Loading from '@components/Loading';

import { AuthContext } from '@components/contexts/AuthProvider';
import { Button } from '@components/buttons/Button';
import { Input } from '@components/Input';
import { Text } from '@components/Text';
import { Flex } from '@components/Flex';
import Link from '@components/Link';

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
    <main>
      <Flex direction="column" alignItems="center" gap="5xl">
        <img src="/imgs/Logo.svg" alt="logo" width="150px" height="48px" />

        <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%', maxWidth: '400px' }}>
          <Flex direction="column" gap="md">
            <Flex direction="column" gap="xs">
              <Input
                type="email"
                placeholder="아이디"
                {...register('email', { required: true })}
                fullWidth
                size="md"
                error={!!errors.email}
              />
              {errors?.email && (
                <Text size="xs" color="error">
                  {errors.email?.message}
                </Text>
              )}
            </Flex>
            <Flex direction="column" gap="xs">
              <Input
                type="password"
                placeholder="비밀번호"
                {...register('password', { required: true })}
                fullWidth
                size="md"
                error={!!errors.password}
              />
              {errors?.password && (
                <Text size="xs" color="error">
                  {errors.password?.message}
                </Text>
              )}
            </Flex>

            <Button type="submit" disabled={isMutating} variant="primary" size="md" fullWidth>
              {isMutating ? <Loading /> : '로 그 인'}
            </Button>

            <GoogleOAuthButton>Log in with Google</GoogleOAuthButton>
          </Flex>
        </form>

        <div>
          <Flex justifyContent="center" alignItems="center" gap="md">
            <span>처음이신가요?</span>
            <Link to="/signup" type="text">
              회원가입하기
            </Link>
          </Flex>
          <Flex justifyContent="center" alignItems="center" gap="md">
            <span>아이디를 잊으셨나요?</span>
            <Link to="/login/find-id" type="text">
              아이디 찾기
            </Link>
          </Flex>
        </div>
      </Flex>
    </main>
  );
}
