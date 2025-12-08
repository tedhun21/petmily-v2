import styled from '@emotion/styled';

import { Title } from '@/styles/commonStyle';
import PhotoReviews from './component/PhotoReviews';
import NavHeader from '@/components/headers/NavigationHeader';

export default function ReviewsPage() {
  return (
    <>
      <NavHeader />
      <Main>
        <Title>펫밀리 이용 후기</Title>
        <PhotoReviews />
      </Main>
    </>
  );
}

const Main = styled.main`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.xl};
  padding: ${({ theme }) => theme.space.xl};
`;
