import Flex from '@components/styled/Flex';
import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';

function SkeletonCard() {
  return (
    <Card>
      <Flex justifyContent="space-between" alignItems="flex-start">
        <Flex alignItems="center" gap="xs">
          <SkeletonElement style={{ width: '46px', height: '46px', borderRadius: '50%' }} />
          <SkeletonElement style={{ width: '80px', height: '21px' }} />
        </Flex>
        <SkeletonElement style={{ width: '50px', height: '28px' }} />
      </Flex>
      <Flex gap="sm">
        <SkeletonElement style={{ width: '100%', height: '18px' }} />
        <SkeletonElement style={{ width: '80%', height: '18px' }} />
        <SkeletonElement style={{ width: '40%', height: '18px', alignSelf: 'flex-end' }} />
      </Flex>
    </Card>
  );
}

export default function RealTimeReviewsSkeleton() {
  return (
    <Container>
      {Array.from({ length: 5 }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </Container>
  );
}

const pulse = keyframes`
  50% {
    opacity: 0.5;
  }
`;

const SkeletonElement = styled.div`
  background-color: ${({ theme }) => theme.colors.background.box.default.hover};
  border-radius: ${({ theme }) => theme.radius.md};
  animation: ${pulse} 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
`;

// TODO
const Container = styled.div`
  display: flex;
  justify-content: center;
  overflow-x: auto;
  width: 100%;
  gap: ${({ theme }) => theme.spacing.lg};

  /* 스크롤바 숨기기 */
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, and Opera */
  }
`;

// TODO
const Card = styled.div`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  width: 300px;
  height: 156px;
  padding: ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.background.box.default.primary};
  border-radius: ${({ theme }) => theme.radius.lg};
  gap: ${({ theme }) => theme.spacing.md};
`;
