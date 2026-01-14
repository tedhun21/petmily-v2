import styled from '@emotion/styled';
import Flex from '@/components/styled/Flex';
import { pulse } from '@/styles/commonStyle';

export default function PhotoReviewCardSkeleton() {
  return (
    <ReviewCard>
      <SkeletonImage />
      <Flex direction="column" gap="xs">
        <TitleContainer />

        <Flex direction="column" gap="xs">
          <ReviewText />
          <ReviewText />
          <ReviewText />
        </Flex>
      </Flex>

      <PetsitterContainer />
    </ReviewCard>
  );
}

const ReviewCard = styled.article`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: ${({ theme }) => theme.space.lg};
`;

const SkeletonElement = styled.div`
  background-color: ${({ theme }) => theme.colors.background.box.default.hover};
  border-radius: ${({ theme }) => theme.radius.md};
  animation: ${pulse} 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
`;

const SkeletonImage = styled(SkeletonElement)`
  width: 100%;
  aspect-ratio: 1/1;
  border-radius: ${({ theme }) => theme.radius.lg};
`;

const TitleContainer = styled(SkeletonElement)`
  width: 20%;
  height: ${({ theme }) => theme.space['2xl']};
  padding: ${({ theme }) => theme.space.sm};
`;

const ReviewText = styled(SkeletonElement)`
  width: 50%;
  height: ${({ theme }) => theme.space.xl};
`;

const PetsitterContainer = styled(SkeletonElement)`
  width: 100%;
  height: 68px;
`;
