import { useRef, useEffect, useState } from 'react';
import styled from '@emotion/styled';
import Text from '@/components/styled/Text';
import Button from '@/components/styled/Button';
import Flex from '@/components/styled/Flex';

interface LocationCapsuleContainerProps {
  data: string[];
  handleLocationClick: (searchName: string) => void;
}

export default function LocationCapsuleContainer({ data, handleLocationClick }: LocationCapsuleContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [columnCount, setColumnCount] = useState(3); // 기본값 3

  useEffect(() => {
    const updateColumnCount = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth;

        if (width >= 430) {
          setColumnCount(4); // 600px 이상이면 4개
        } else {
          setColumnCount(3); // 600px 미만이면 3개
        }
      }
    };

    updateColumnCount(); // 초기 렌더 시 실행
    window.addEventListener('resize', updateColumnCount);

    return () => {
      window.removeEventListener('resize', updateColumnCount);
    };
  }, []);

  return (
    <Flex ref={containerRef} direction="column" gap="lg">
      <Text size="xs">서울</Text>
      <List $columnCount={columnCount}>
        {data.map((location: string) => (
          <Button key={location} onClick={() => handleLocationClick(location)}>
            {location}
          </Button>
        ))}
      </List>
    </Flex>
  );
}

const List = styled.ul<{ $columnCount: number }>`
  display: grid;
  grid-template-columns: repeat(${({ $columnCount }) => $columnCount}, 1fr);
  gap: ${({ theme }) => theme.space.sm};
  width: 100%;
`;
