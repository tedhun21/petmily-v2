import styled, { keyframes } from 'styled-components';
import { Column } from 'styles/commonStyle';

export default function PhotoReviewCardSkeleton() {
  return (
    <ReviewCard>
      <SkeletonImage />
      <ReviewContainer>
        <TitleContainer />

        <ReviewWrapper>
          <ReviewText />
          <ReviewText />
          <ReviewText />
        </ReviewWrapper>
      </ReviewContainer>

      <PetsitterContainer />
    </ReviewCard>
  );
}

const ReviewCard = styled.article`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 16px;
`;

const pulse = keyframes`
    50% {
        opacity:0.5
    }
`;

const SkeletonElement = styled.div`
  background-color: ${({ theme }) => theme.background.box.default.hover};
  animation: ${pulse} 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; /* pulse 애니메이션 
       적용 */
  border-radius: 16px;
`;

const SkeletonImage = styled(SkeletonElement)`
  width: 100%;
  aspect-ratio: 1/1;
  border-radius: ${({ theme }) => theme.radius.large};
`;

const ReviewContainer = styled(Column)`
  gap: 4px;
`;

const TitleContainer = styled(SkeletonElement)`
  width: 20%;
  height: 24px;
  padding: 8px;
`;

const ReviewWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ReviewText = styled(SkeletonElement)`
  width: 50%;
  height: 20px;
`;

const PetsitterContainer = styled(SkeletonElement)`
  width: 100%;
  height: 68px;
`;
