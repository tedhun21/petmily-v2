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
  gap: ${({ theme }) => theme.spacing.sm};
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radius.md};
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
  padding: ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.background.box.default.primary};
  border-radius: ${({ theme }) => theme.radius.md};
`;
