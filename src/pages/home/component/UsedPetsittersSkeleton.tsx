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
  gap: ${({ theme }) => theme.spacing.sm};
`;

const SkeletonItem = styled.li`
  display: flex;
  width: 220px;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const pulse = keyframes`
    50% {
        opacity:0.5
    }
`;

const SkeletonElement = styled.div`
  background-color: ${({ theme }) => theme.colors.background.box.default.hover};
  border-radius: ${({ theme }) => theme.radius.md};
  animation: ${pulse} 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; /* pulse 애니메이션 
       적용 */
`;

const SkeletonImage = styled(SkeletonElement)`
  flex-shrink: 0;
  width: 60px;
  height: 60px;
  background-color: ${({ theme }) => theme.colors.background.box.default.hover};
  border-radius: ${({ theme }) => theme.radius.circle};
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
