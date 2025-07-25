import { useEffect } from 'react';

import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAuthSWR, useAuthSWRMutation } from 'hooks/authSWR';

import { toast } from 'react-toastify';

import { fetcher, updater } from 'api';
import { UserRole } from 'types/user.type';
import Loading from '@components/Loading';

// 1. URL에서 액세스 토큰 파싱
// 2. 액세스 토큰을 이용해 내 정보 가져오기
// 3. 내 정보에 대해 조건부 처리
export default function RedirectPage() {
  const navigate = useNavigate();

  const { data: me } = useAuthSWR('/users/me', fetcher);

  // 유저 role update
  const { trigger: updateUserRole } = useAuthSWRMutation(me ? `/users/${me.id}` : null, updater, {});

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
      window.location.replace('/');
      toast.success('환영합니다!');
    }
  }, [me, navigate]);

  return (
    <MainContainer>
      {me && me.role === UserRole.USER ? (
        <ImgContainer>
          <ImageButton onClick={handleClientOAuth}>
            <Image src="/imgs/Signupforclient.png" alt="보호자로 가입하기" />
            <ClientSign>보호자로 가입하기</ClientSign>
          </ImageButton>
          <ImageButton onClick={handlePetsitterOAuth}>
            <Image src="/imgs/Signupforpetsitter.png" alt="펫시터로 가입하기" />
            <PetsitterSign>펫시터로 가입하기</PetsitterSign>
          </ImageButton>
        </ImgContainer>
      ) : (
        <Loading />
      )}
    </MainContainer>
  );
}

const MainContainer = styled.main`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 40px;
`;

const ImgContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 32px;
`;

const ImageButton = styled.button`
  position: relative;
  border: none;
  transition: all 0.2s linear;
  border-radius: ${({ theme }) => theme.radius.normal};
  background-color: transparent;

  &:hover {
    transform: scale(1.01);

    & > div {
      color: ${({ theme }) => theme.text.highlight};
      transition: all 0.2s linear;
      font-family: inherit;
      ${({ theme }) => theme.fontSize.s20h30}
    }
  }
`;

const ClientSign = styled.div`
  width: 100%;
  text-align: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: black;
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  pointer-events: none;

  ${({ theme }) => theme.fontSize.s18h27}
`;

const PetsitterSign = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  pointer-events: none;

  ${({ theme }) => theme.fontSize.s18h27};
`;

const Image = styled.img`
  width: 100%;
  opacity: 0.5;
  transition: all 0.1s linear;

  &:hover {
    opacity: 1;
  }
`;
