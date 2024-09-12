import styled from 'styled-components';
import { Link } from 'react-router-dom';

import HomeAd from '@components/HomeAd';
import Footer from '@components/footer/Footer';
import RealTimeReviews from './RealTimeReviews';
import OffenPetsitters from './OffenPetsitters';

import { getMe } from '@pages/common/api';
import useSWR from 'swr';

const API_URL = process.env.REACT_APP_API_URL;

export default function Home() {
  const { data: me, error, isLoading } = useSWR(`${API_URL}/users/me`, getMe);

  return (
    <>
      <HomeContainer>
        {/* <CustomLink to={'/search'}>펫시터 검색</CustomLink> */}
        <HomeAd />
        <LinkContainer>
          <PetsitterLink to="/petsitters">펫시터 보기</PetsitterLink>
          <PetsitterLink to="/qna">펫시터 QnA</PetsitterLink>
        </LinkContainer>
        <AdSubContainer>
          <AdSubText>{'첫 만남\n 50% 할인 쿠폰'}</AdSubText>
          <img src="/imgs/HomeSubAd.svg" alt="Advertising" />
        </AdSubContainer>
        <img src="/imgs/HomeTitleAd.svg" alt="Advertising" width="100%" />
        <OffenPetsitters />
        <RealTimeReviews />
      </HomeContainer>
      <Footer />
    </>
  );
}

const HomeContainer = styled.main`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 16px;
  padding: 12px;
  gap: 20px;
`;

const LinkContainer = styled.div`
  display: flex;
  gap: 12px;
`;

const PetsitterLink = styled(Link)`
  flex: 1;
  display: flex;
  justify-content: center;
  padding: 20px 24px;
  ${(props) => props.theme.fontSize.s16h24};
  font-weight: ${(props) => props.theme.fontWeights.bold};
  box-shadow: ${(props) => props.theme.shadow.dp01};
  color: ${(props) => props.theme.colors.black};

  &:visited {
    text-decoration: none;
  }
`;

const AdSubContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-radius: 8px;
  background-color: ${(props) => props.theme.colors.white};
  box-shadow: ${(props) => props.theme.shadow.dp01};
`;

const AdSubText = styled.div`
  ${(props) => props.theme.fontSize.s14h21};
  font-weight: 600;
  white-space: pre-line;
`;

export const ImageContainer = styled.div`
  overflow: hidden;
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 50%;
`;
