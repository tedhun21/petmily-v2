import styled from 'styled-components';

import { Title } from 'styles/commonStyle';
import PhotoReviews from './component/PhotoReviews';
import NavHeader from '@components/headers/NavHeader';

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
  gap: ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => theme.spacing.xl};
`;
