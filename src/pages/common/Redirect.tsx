import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styled from '@emotion/styled';
import { toast } from 'react-toastify';

import { useAuthSWR, useAuthSWRMutation } from '@/hooks/authSWR';
import { fetcher, updater } from '@/api';
import { UserRole } from '@/types/user.type';
import Loading from '@/components/Loading';
import Flex from '@/components/styled/Flex';
import type { RootState } from '@/store';

export default function RedirectPage() {
  const navigate = useNavigate();

  const { accessToken } = useSelector((state: RootState) => state.auth);

  const { data: me, error } = useAuthSWR(accessToken ? '/users/me' : null, fetcher, {});

  // 유저 role update
  const { trigger: updateUserRole } = useAuthSWRMutation(me ? `/users/${me.id}` : null, updater);

  const handleClientOAuth = async () => {
    const formData = new FormData();

    formData.append('data', JSON.stringify({ role: UserRole.CLIENT }));

    await updateUserRole(formData);
  };

  const handlePetsitterOAuth = async () => {
    const formData = new FormData();

    formData.append('data', JSON.stringify({ role: UserRole.PETSITTER }));

    await updateUserRole(formData);
  };

  useEffect(() => {
    if (me && me.role !== UserRole.USER) {
      navigate('/', { replace: true });
      toast.success('환영해요!');
    }
  }, [me, navigate]);

  if (!me && !error) {
    return <Loading />;
  }

  return (
    <Flex as="main" justifyContent="center" alignItems="center">
      {me && me.role === UserRole.USER ? (
        <Flex direction="column" gap="3xl">
          <ImageButton onClick={handleClientOAuth}>
            <Image src="/imgs/Signupforclient.png" alt="보호자로 가입하기" />
            <ClientSign>보호자로 가입하기</ClientSign>
          </ImageButton>
          <ImageButton onClick={handlePetsitterOAuth}>
            <Image src="/imgs/Signupforpetsitter.png" alt="펫시터로 가입하기" />
            <PetsitterSign>펫시터로 가입하기</PetsitterSign>
          </ImageButton>
        </Flex>
      ) : null}
    </Flex>
  );
}

const ImageButton = styled.button`
  position: relative;
  background-color: transparent;
  border: none;
  border-radius: ${({ theme }) => theme.radius.md};
  transition: all 0.2s linear;

  &:hover {
    transform: scale(1.01);

    & > div {
      color: ${({ theme }) => theme.colors.text.highlight};
      font-family: inherit;
      transition: all 0.2s linear;
      ${({ theme }) => theme.typeScale.xl};
    }
  }
`;

const ClientSign = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  transform: translate(-50%, -50%);
  color: black;
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  text-align: center;
  pointer-events: none;

  ${({ theme }) => theme.typeScale.lg};
`;

const PetsitterSign = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  pointer-events: none;

  ${({ theme }) => theme.typeScale.lg};
`;

const Image = styled.img`
  width: 100%;
  opacity: 0.5;
  transition: all 0.1s linear;

  &:hover {
    opacity: 1;
  }
`;
