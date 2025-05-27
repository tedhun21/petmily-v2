import { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Column, Texts12h18 } from 'styles/commonStyle';

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
      <Texts12h18>서울</Texts12h18>
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

const Container = styled(Column)`
  flex: 1 1 auto;
  gap: 16px;
`;

const List = styled.ul<{ $columnCount: number }>`
  display: grid;
  grid-template-columns: repeat(${({ $columnCount }) => $columnCount}, 1fr);
  gap: 8px;
  width: 100%;
`;

const Item = styled.li`
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid ${({ theme }) => theme.line.box.primary};
  border-radius: ${({ theme }) => theme.radius.large};
  padding: 8px;
  cursor: pointer;
  font-weight: ${({ theme }) => theme.fontWeight.light};
  ${({ theme }) => theme.fontSize.s14h21};

  &:hover {
    border: 2px solid ${({ theme }) => theme.line.box.highlight};
  }

  $:active {
    transform: scale(0.95);
    transition: transform 0.1s ease-out;
  }
`;
