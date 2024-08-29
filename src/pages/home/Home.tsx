import styled from 'styled-components';

import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Link } from 'react-router-dom';

import HomeAd from '@components/HomeAd';

import Footer from '@components/footer/Footer';

import RealTimeReviews from './RealTimeReviews';
import OffenPetsitters from './OffenPetsitters';
export default function Home() {
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

// const CustomLink = styled(Link)`
//   margin-top: 16px;
//   text-decoration: none;
//   color: #a3a3a3;
//   background-color: ${(props) => props.theme.lineColors.coolGray90};
//   padding: 10px 12px;
//   border-radius: 8px;
//   font-weight: ${(props) => props.theme.fontWeights.bold};
//   ${(props) => props.theme.fontSize.s12h18};
// `;

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
