import { HiOutlineLocationMarker } from 'react-icons/hi';
import styled from 'styled-components';

export default function SuggestLocations({ data, handleLocationClick }: any) {
  return (
    <List>
      {data.map((location: string, index: number) => (
        <Item key={index}>
          <Button type="button" onClick={(e) => handleLocationClick(e, location)}>
            <Icon>
              <HiOutlineLocationMarker size="20px" />
            </Icon>
            <span>{location}</span>
          </Button>
        </Item>
      ))}
    </List>
  );
}

const List = styled.ul`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Item = styled.li`
  gap: 8px;
  width: 100%;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px;
  border-radius: ${({ theme }) => theme.radius.normal};

  &:hover {
    background-color: ${({ theme }) => theme.background.highlight};
  }
`;

const Icon = styled.div`
  display: flex;
  justify-contnet: center;
  align-items: center;
  background-color: ${({ theme }) => theme.background.box.default.primary};
  padding: 8px;
  border-radius: ${({ theme }) => theme.radius.normal};
`;
