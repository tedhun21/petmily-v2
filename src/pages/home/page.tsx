import styled from 'styled-components';
import { Link } from 'react-router-dom';

import HomeAd from '@pages/home/components/HomeAd';
import RealTimeReviews from './components/RealTimeReviews';
import UsedPetsitters from './components/UsedPetsitters';
import NavigationHeader from '@components/headers/NavigationHeader';
import EventSwiper from './components/EventSwiper';
import AdSwiper from './components/AdSwiper';
import SearchBox from '@pages/search/component/SearchBox';
import { Button } from '@components/buttons/Button';
import Box from '@components/Box';

export default function HomePage() {
  return (
    <>
      <NavigationHeader />
      <main>
        <HomeAd />

        <NoticeWrapper>
          <Button as={Link} to="/faq" variant="secondary" size="lg">
            자주 묻는 질문
          </Button>
        </NoticeWrapper>

        <Box p="md">
          <EventSwiper />
        </Box>

        <Box p="md">
          <AdSwiper />
        </Box>

        <Box p="md">
          <SearchBox />
        </Box>

        <UsedPetsitters />

        <RealTimeReviews />
      </main>
    </>
  );
}

const NoticeWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 8px;
`;
