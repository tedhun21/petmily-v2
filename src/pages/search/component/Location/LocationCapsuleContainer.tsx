import { useRef, useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { Text } from '@/components/styled/Text';

interface LocationCapsuleContainerProps {
  data: string[];
  handleLocationClick: (e: React.MouseEvent, searchName: string) => void;
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
    <Container ref={containerRef}>
      <Text size="xs">서울</Text>
      <List $columnCount={columnCount}>
        {data.map((location: string) => (
          <Item key={location} onClick={(e) => handleLocationClick(e, location)}>
            {location}
          </Item>
        ))}
      </List>
    </Container>
  );
}

// TODO
const Container = styled.div`
  display: flex;
  flex: 1 1 auto;
  gap: ${({ theme }) => theme.space.lg};
`;

const List = styled.ul<{ $columnCount: number }>`
  display: grid;
  grid-template-columns: repeat(${({ $columnCount }) => $columnCount}, 1fr);
  gap: ${({ theme }) => theme.space.sm};
  width: 100%;
`;

const Item = styled.li`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.space.sm};
  border: 2px solid ${({ theme }) => theme.colors.line.box.primary};
  border-radius: ${({ theme }) => theme.radius.lg};
  font-weight: ${({ theme }) => theme.fontWeight.light};
  cursor: pointer;
  ${({ theme }) => theme.typeScale.sm};

  &:hover {
    border: 2px solid ${({ theme }) => theme.colors.line.box.highlight};
  }

  :active {
    transform: scale(0.95);
    transition: transform 0.1s ease-out;
  }
`;
