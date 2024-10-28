import styled from 'styled-components';

import { Title } from 'commonStyle';
import PhotoReviews from './component/PhotoReviews';

export default function Reviews() {
  return (
    <ReviewSection>
      <Title>펫밀리 이용 후기</Title>
      <PhotoReviews />
    </ReviewSection>
  );
}

const ReviewSection = styled.main`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 20px;
  padding: 20px;
`;
