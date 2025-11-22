import styled from '@emotion/styled';

import HomeAd from '@pages/home/components/HomeAd';
import RealTimeReviews from './components/RealTimeReviews';
import UsedPetsitters from './components/UsedPetsitters';
import NavigationHeader from '@components/headers/NavigationHeader';
import EventSwiper from './components/EventSwiper';
import AdSwiper from './components/AdSwiper';
import SearchBox from '@pages/search/component/SearchBox';
import Box from '@components/styled/Box';
import Link from '@components/styled/Link';

export default function HomePage() {
  return (
    <>
      <NavigationHeader />
      <main>
        <HomeAd />

        <NoticeWrapper>
          <Link to="/faq" type="icon">
            자주 묻는 질문
          </Link>
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
