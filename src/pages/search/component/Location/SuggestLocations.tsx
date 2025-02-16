import { HiOutlineLocationMarker } from 'react-icons/hi';
import styled from 'styled-components';
import { Texts14h21 } from 'styles/commonStyle';

export default function SuggestLocations({ data, handleLocationClick }: any) {
  return (
    <List>
      {data?.map((location: string, index: number) => (
        <Item key={index} onClick={(e) => handleLocationClick(e, location)}>
          <IconBox>
            <HiOutlineLocationMarker size="20px" />
          </IconBox>
          <Texts14h21>{location}</Texts14h21>
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
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px;
  border-radius: ${({ theme }) => theme.radius.normal};
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.background.highlight};

    ${Texts14h21} {
      color: white;
    }
  }
`;

const IconBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.background.box.default.primary};
  padding: 8px;
  border-radius: ${({ theme }) => theme.radius.normal};
`;
