import styled, { keyframes } from 'styled-components';
import { Column, Row } from 'styles/commonStyle';

function SkeletonCard() {
  return (
    <Card>
      <ClientContainer>
        <ClientImageName>
          <SkeletonElement style={{ width: '46px', height: '46px', borderRadius: '50%' }} />
          <SkeletonElement style={{ width: '80px', height: '21px' }} />
        </ClientImageName>
        <SkeletonElement style={{ width: '50px', height: '28px' }} />
      </ClientContainer>
      <ContentContainer>
        <SkeletonElement style={{ width: '100%', height: '18px' }} />
        <SkeletonElement style={{ width: '80%', height: '18px' }} />
        <SkeletonElement style={{ width: '40%', height: '18px', alignSelf: 'flex-end' }} />
      </ContentContainer>
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

const Container = styled(Row)`
  justify-content: center;
  overflow-x: auto;
  width: 100%;
  gap: ${({ theme }) => theme.spacing.lg};

  /* 스크롤바 숨기기 */
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, and Opera */
  }
`;

const Card = styled(Column)`
  flex-shrink: 0;
  width: 300px;
  height: 156px;
  padding: ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.background.box.default.primary};
  border-radius: ${({ theme }) => theme.radius.lg};
  gap: ${({ theme }) => theme.spacing.md};
`;

const ClientContainer = styled(Row)`
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
`;

const ClientImageName = styled(Row)`
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const ContentContainer = styled(Column)`
  gap: ${({ theme }) => theme.spacing.sm};
  width: 100%;
`;
