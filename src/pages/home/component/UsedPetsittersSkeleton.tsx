import styled, { keyframes } from 'styled-components';
import { Column } from 'styles/commonStyle';

export default function UsedPetsittersSkeleton() {
  const count = 3;

  return (
    <SkeletonList>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonItem key={i}>
          <SkeletonImage />
          <Div>
            <Name />
            <Name2 />
            <Name3 />
          </Div>
        </SkeletonItem>
      ))}
    </SkeletonList>
  );
}

const SkeletonList = styled.ul`
  display: flex;
  gap: 8px;
`;

const SkeletonItem = styled.li`
  width: 220px;
  display: flex;
  gap: 8px;
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
  flex-shrink: 0;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.background.box.default.hover};
`;

const Div = styled(Column)`
  flex: 1;
  justify-content: space-between;
`;

const Name = styled(SkeletonElement)`
  width: 80%;
  height: 12px;
`;

const Name2 = styled(SkeletonElement)`
  width: 85%;
  height: 12px;
`;

const Name3 = styled(SkeletonElement)`
  width: 70%;
  height: 12px;
`;
