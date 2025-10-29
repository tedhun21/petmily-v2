import styled from 'styled-components';

import 'swiper/css';
import 'swiper/css/pagination';

import HomeAd from '@components/HomeAd';

import { DefaultLink } from 'styles/commonStyle';
import RealTimeReviews from './component/RealTimeReviews';
import UsedPetsitters from './component/UsedPetsitters';
import NavHeader from '@components/headers/NavHeader';

import EventSwiper from './component/EventSwiper';
import AdSwiper from './component/AdSwiper';
import SearchBox from '@pages/search/component/SearchBox';

export default function HomePage() {
  return (
    <>
      <NavHeader />
      <Main>
        <HomeAd />
        <LinkContainer>
          <PetsitterLink to="/faq">자주 묻는 질문</PetsitterLink>
        </LinkContainer>

        <EventSwiper />
        <AdSwiper />

        <SearchBox />

        <UsedPetsitters />

        <RealTimeReviews />
      </Main>
    </>
  );
}

const Main = styled.main`
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

const PetsitterLink = styled(DefaultLink)`
  display: flex;
  justify-content: center;
  padding: 24px;
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  border-radius: 16px;

  ${({ theme }) => theme.fontSize.s16h24};

  // &:visited {
  //   text-decoration: none;
  // }
`;
