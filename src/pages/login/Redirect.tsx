import { useEffect } from 'react';

import styled from 'styled-components';
import useSWR from 'swr';
import { fetcherWithToken, updaterWithToken } from 'api';

import { User, UserRole } from 'types/user';
import { useNavigate } from 'react-router-dom';
import { setCookie } from 'utils/cookie';
import useSWRMutation from 'swr/mutation';
import Loading from '@components/Loading';

const API_URL = process.env.REACT_APP_API_URL;

export default function Redirect() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);

  const access_token = urlParams.get('access_token');

  const { data: me } = useSWR<User>(access_token ? `${API_URL}/users/me` : null, (url: string) =>
    fetcherWithToken(url, access_token),
  );

  const { trigger } = useSWRMutation(
    me ? `${API_URL}/users/${me.id}` : null,
    (url: string, { arg }: { arg: any }) => updaterWithToken(url, access_token, { arg }),
    {
      onSuccess: (data) => {
        setCookie('access_token', data.newToken);
        navigate('/');
      },
    },
  );

  const handleClientOAuth = async () => {
    const formData = new FormData();

    formData.append('data', JSON.stringify({ role: UserRole.CLIENT }));

    await trigger({ formData });
  };

  const handlePetsitterOAuth = async () => {
    const formData = new FormData();

    formData.append('data', JSON.stringify({ role: UserRole.PETSITTER }));

    await trigger({ formData });
  };

  useEffect(() => {
    if (me && access_token && (me.role === UserRole.CLIENT || me.role === UserRole.PETSITTER)) {
      setCookie('access_token', access_token);
      navigate('/');
    }
  }, [me]);

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
  border-radius: 8px;
  background-color: transparent;

  &:hover {
    transform: scale(1.01);

    & > div {
      color: ${({ theme }) => theme.colors.mainBlue};
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
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  pointer-events: none;

  ${({ theme }) => theme.fontSize.s18h27}
`;

const PetsitterSign = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-weight: ${({ theme }) => theme.fontWeights.bold};
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
