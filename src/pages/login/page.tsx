/** @jsxImportSource @emotion/react */
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import useSWRMutation from 'swr/mutation';
import { toast } from 'react-toastify';

import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { poster } from '@/api';
import GoogleOAuthButton from '@/components/buttons/OAuthButton';
import Spinner from '@/components/Spinner';

import Button from '@/components/styled/Button';
import Text from '@/components/styled/Text';
import Flex from '@/components/styled/Flex';
import Link from '@/components/styled/Link';
import Box from '@/components/styled/Box';
import { Input } from '@/components/styled/Input';
import { AuthContext } from '@/components/contexts/AuthContext';
import { Divider } from '@/styles/commonStyle';
import type { AxiosError } from 'axios';

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
        toast.success('환영해요!');
      }
    },
    onError: () => {
      toast.error('로그인에 실패헸어요. 다시 시도해 주세요');
    },
  });

  const onSubmit = async (data: IFormLoginInputs) => {
    const { email, password } = data;

    await trigger(
      { email, password },
      {
        onError: (error: AxiosError) => {
          if (error.response) {
            const data = error.response.data as { statusCode: number; error: string; message: string };
            // not found
            if (data.statusCode === 404) {
              setError('email', {
                type: data.error,
                message: data.message,
              });
            }
            // unauthorized
            if (data.statusCode === 401) {
              setError('password', {
                type: data.error,
                message: data.message,
              });
            }
          }
        },
      },
    );
  };

  return (
    <Box as="main" pt="5xl">
      <Flex direction="column" justifyContent="center" alignItems="center" gap="5xl">
        <Link to="/" type="image">
          <img src="/imgs/Logo.svg" alt="logo" width="150px" height="48px" />
        </Link>

        <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: '360px', width: '100%' }}>
          <Flex direction="column" gap="2xl">
            <Flex direction="column" gap="sm">
              <div>
                <Input
                  type="email"
                  placeholder="아이디"
                  {...register('email', { required: true })}
                  inputSize="md"
                  error={!!errors.email}
                  fullWidth
                />

                <div style={{ minHeight: 18 }}>
                  {errors?.email && (
                    <Text size="xs" color="error">
                      {errors.email?.message}
                    </Text>
                  )}
                </div>
              </div>
              <div>
                <Input
                  type="password"
                  placeholder="비밀번호"
                  {...register('password', { required: true })}
                  fullWidth
                  inputSize="md"
                  error={!!errors.password}
                />

                <div style={{ minHeight: 18 }}>
                  {errors?.password && (
                    <Text size="xs" color="error">
                      {errors.password?.message}
                    </Text>
                  )}
                </div>
              </div>
            </Flex>

            <Flex direction="column" gap="md">
              <Button type="submit" disabled={isMutating} variant="primary" size="md" fullWidth>
                {isMutating ? <Spinner /> : '로 그 인'}
              </Button>

              <Flex alignItems="center" gap="sm">
                <Divider />
                <span>OR</span>
                <Divider />
              </Flex>

              <div>
                <GoogleOAuthButton>Log in with Google</GoogleOAuthButton>
              </div>
            </Flex>
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
    </Box>
  );
}
