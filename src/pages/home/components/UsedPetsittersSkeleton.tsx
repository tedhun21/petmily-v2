import styled from '@emotion/styled';
import Box from '@/components/styled/Box';
import Flex from '@/components/styled/Flex';
import { pulse } from '@/styles/commonStyle';

export default function UsedPetsittersSkeleton() {
  const count = 3;

  return (
    <Flex as="ul" gap="sm">
      {Array.from({ length: count }).map((_, i) => (
        <Box key={i} w="220px">
          <Flex gap="sm">
            <SkeletonImage />
            <Flex direction="column" justifyContent="space-between">
              <Name />
              <Name2 />
              <Name3 />
            </Flex>
          </Flex>
        </Box>
      ))}
    </Flex>
  );
}

const SkeletonElement = styled.div`
  background-color: ${({ theme }) => theme.colors.background.box.default.hover};
  border-radius: ${({ theme }) => theme.radius.md};
  animation: ${pulse} 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
`;

const SkeletonImage = styled(SkeletonElement)`
  flex-shrink: 0;
  width: 60px;
  height: 60px;
  background-color: ${({ theme }) => theme.colors.background.box.default.hover};
  border-radius: ${({ theme }) => theme.radius.circle};
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
