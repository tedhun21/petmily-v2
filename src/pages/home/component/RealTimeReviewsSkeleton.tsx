import styled, { keyframes } from 'styled-components';

const pulse = keyframes`
  50% {
    opacity: 0.5;
  }
`;

const SkeletonElement = styled.div`
  background-color: ${({ theme }) => theme.background.box.default.hover};
  animation: ${pulse} 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  border-radius: 16px;
`;

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

const Container = styled.div`
  display: flex;
  gap: 16px;
  width: 100%;
  overflow-x: auto;
  justify-content: center;
  // 스크롤바 숨기기
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, and Opera */
  }
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  width: 300px;
  height: 156px;
  padding: 16px;
  gap: 12px;
  border-radius: ${({ theme }) => theme.radius.large};
  background-color: ${({ theme }) => theme.background.box.default.primary};
`;

const ClientContainer = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;
`;

const ClientImageName = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`;
