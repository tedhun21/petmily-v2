import styled from 'styled-components';

import 'swiper/css';
import 'swiper/css/pagination';

import HomeAd from '@components/HomeAd';

import RealTimeReviews from './components/RealTimeReviews';
import UsedPetsitters from './components/UsedPetsitters';
import NavHeader from '@components/headers/NavHeader';

import EventSwiper from './components/EventSwiper';
import AdSwiper from './components/AdSwiper';
import SearchBox from '@pages/search/component/SearchBox';
import { Link } from 'react-router-dom';
import { Button } from 'styles/common/Button';

export default function HomePage() {
  return (
    <>
      <NavHeader />
      <Main>
        <HomeAd />

        <NoticeWrapper>
          <Button as={Link} to="/faq" $variant="secondary" $size="lg">
            자주 묻는 질문
          </Button>
        </NoticeWrapper>

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
  padding: ${({ theme }) => theme.spacing.md};
  gap: ${({ theme }) => theme.spacing.xl};
`;

const NoticeWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`;
