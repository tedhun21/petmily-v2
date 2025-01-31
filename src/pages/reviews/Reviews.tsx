import styled from 'styled-components';

import { Title } from 'styles/commonStyle';
import PhotoReviews from './component/PhotoReviews';
import NavHeader from '@components/headers/NavHeader';

export default function Reviews() {
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
  gap: 20px;
  padding: 20px;
`;
