import styled from 'styled-components';
import { Column, Texts12h18 } from 'styles/commonStyle';

export default function LocationCapsuleContainer({ data, handleLocationClick }: any) {
  return (
    <Container>
      <Texts12h18>서울</Texts12h18>
      <List>
        {data.map((location: string) => (
          <Item key={location}>
            <Button type="button" onClick={(e) => handleLocationClick(e, location)}>
              {location}
            </Button>
          </Item>
        ))}
      </List>
    </Container>
  );
}

const Container = styled(Column)`
  flex: auto;
  gap: 16px;
`;

const List = styled.ul`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
`;

const Item = styled.li`
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.line.box.primary};
  border-radius: ${({ theme }) => theme.radius.large};
  padding: 8px;
  cursor: pointer;
  font-weight: ${({ theme }) => theme.fontWeight.light};
  ${({ theme }) => theme.fontSize.s14h21};

  &:hover {
    border: 1px solid ${({ theme }) => theme.line.box.highlight};
  }

  $:active {
    transform: scale(0.95);
    transition: transform 0.1s ease-out;
  }
`;

const Button = styled.button``;
