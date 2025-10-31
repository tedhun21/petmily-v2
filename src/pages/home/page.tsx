import styled from 'styled-components';

import 'swiper/css';
import 'swiper/css/pagination';

import HomeAd from '@components/HomeAd';

import { DefaultLink, Row } from 'styles/commonStyle';
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
  padding: ${({ theme }) => theme.spacing.md};
  gap: ${({ theme }) => theme.spacing.xl};
`;

const LinkContainer = styled(Row)`
  gap: ${({ theme }) => theme.spacing.md};
`;

const PetsitterLink = styled(DefaultLink)`
  display: flex;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing._2xl};
  border-radius: ${({ theme }) => theme.radius.md};
  font-weight: ${({ theme }) => theme.fontWeight.bold};

  ${({ theme }) => theme.typeScale.base};
`;
