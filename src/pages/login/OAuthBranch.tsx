import axios from 'axios';
import { getCookieValue } from 'hooks/getCookie';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const apiUrl = process.env.REACT_APP_API_URL;

const OAuthBranch = () => {
  const navigate = useNavigate();

  const handleMemberOAuth = async () => {
    console.log('hi');
  };

  const handlePetsitterOAuth = async () => {
    console.log('hi');
  };

  // OAuth token 받아오기(일반 고객 & 펫시터)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const idToken = urlParams.get('id_token');
    const accessToken = urlParams.get('access_token');

    useEffect(() => {
      axios.get(`${apiUrl}/auth/google/callback?access_token=${accessToken}`).then((res) => {
        console.log(res);
      });
    }, []);
  }, []);

  return (
    <MainContainer>
      <ImgContainer>
        <ImageButton onClick={handleMemberOAuth}>
          <Image src="/imgs/Signupforclient.png" alt="보호자로 가입하기" />
          <ClientSign>보호자로 가입하기</ClientSign>
        </ImageButton>
        <ImageButton onClick={handlePetsitterOAuth}>
          <Image src="/imgs/Signupforpetsitter.png" alt="펫시터로 가입하기" />
          <PetsitterSign>펫시터로 가입하기</PetsitterSign>
        </ImageButton>
      </ImgContainer>
    </MainContainer>
  );
};
export default OAuthBranch;

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

// const ImageLink = styled(Link)`
//   position: relative;
//   transition: all 0.2s linear;

//   &:hover {
//     transform: scale(1.01);
//     & > div {
//       color: ${({ theme }) => theme.colors.mainBlue};
//       transition: all 0.2s linear;
//       ${({ theme }) => theme.fontSize.s20h30}
//     }
//   }
// `;

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
