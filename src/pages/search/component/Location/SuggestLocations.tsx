import { HiOutlineLocationMarker } from 'react-icons/hi';
import styled from 'styled-components';
import { Texts14h20 } from 'styles/commonStyle';

export default function SuggestLocations({ data, handleLocationClick }: any) {
  return (
    <List>
      {data?.map((location: string, index: number) => (
        <Item key={index} onClick={(e) => handleLocationClick(e, location)}>
          <IconBox>
            <HiOutlineLocationMarker size="20px" />
          </IconBox>
          <Texts14h20>{location}</Texts14h20>
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
  border-radius: ${({ theme }) => theme.radius.base};
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colors.background.highlight};

    ${Texts14h20} {
      color: white;
    }
  }
`;

const IconBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px;
  background-color: ${({ theme }) => theme.colors.background.box.default.primary};
  border-radius: ${({ theme }) => theme.radius.base};
`;
