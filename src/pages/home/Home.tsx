import { Link } from 'react-router-dom';
import styled from 'styled-components';

import HomeAd from '@components/HomeAd';
// import Footer from '@components/footer/Footer';

import { Texts14h21, Title } from 'commonStyle';
import RealTimeReviews from './component/RealTimeReviews';
import UsedPetsitters from './component/UsedPetsitters';
import useSWR from 'swr';
import { fetcherWithCookie } from 'api';

const API_URL = process.env.REACT_APP_API_URL;

export default function Home() {
  const { data: me } = useSWR(`${API_URL}/users/me`, fetcherWithCookie);

  return (
    <>
      <HomeContainer>
        <HomeAd />
        <LinkContainer>
          <PetsitterLink to="/search">펫시터 검색</PetsitterLink>
          <PetsitterLink to="/qna">펫시터 QnA</PetsitterLink>
        </LinkContainer>
        <AdSubContainer>
          <AdSubText>{'첫 만남\n 50% 할인 쿠폰'}</AdSubText>
        </AdSubContainer>
        <img src="/imgs/HomeTitleAd.svg" alt="Advertising" width="100%" />

        {me && <UsedPetsitters />}

        <RealTimeReviews />
      </HomeContainer>
      {/* <Footer /> */}
    </>
  );
}

const HomeContainer = styled.main`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 12px;
  gap: 20px;
`;

const LinkContainer = styled.div`
  display: flex;
  gap: 12px;
`;

const StyledDefaultLink = styled(Link)`
  border: 1px solid ${({ theme }) => theme.line.box.default};
  color: ${({ theme }) => theme.text.active};
  background-color: ${({ theme }) => theme.background.box.default.primary};

  &:hover {
    background-color: ${({ theme }) => theme.background.box.default.hover};
  }
`;

const PetsitterLink = styled(Link)`
  flex: 1;
  display: flex;
  justify-content: center;
  padding: 24px;
  color: ${({ theme }) => theme.text.active};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  border: 1px solid ${({ theme }) => theme.line.box.default};
  border-radius: 16px;
  background-color: ${({ theme }) => theme.background.box.default.primary};
  ${({ theme }) => theme.fontSize.s16h24};

  &:visited {
    text-decoration: none;
  }

  &:hover {
    background-color: ${({ theme }) => theme.background.box.default.hover};
  }
`;

const AdSubContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-radius: 16px;
  background-color: ${({ theme }) => theme.background.box.default.primary};
`;

const AdSubText = styled(Texts14h21)`
  color: ${({ theme }) => theme.text.active};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  white-space: pre-line;
`;

export const ImageContainer = styled.div`
  overflow: hidden;
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 50%;
`;
