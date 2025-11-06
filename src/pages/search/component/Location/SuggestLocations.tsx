import { HiOutlineLocationMarker } from 'react-icons/hi';
import styled from 'styled-components';
import { Text } from 'styles/common/Text';
import { Center, Column } from 'styles/commonStyle';

export default function SuggestLocations({ data, handleLocationClick }: any) {
  return (
    <List as="li">
      {data?.map((location: string, index: number) => (
        <Item key={index} onClick={(e) => handleLocationClick(e, location)}>
          <IconBox>
            <HiOutlineLocationMarker size="20px" />
          </IconBox>
          <Text $size="sm" $color="white">
            {location}
          </Text>
        </Item>
      ))}
    </List>
  );
}

const List = styled(Column)`
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
  }
`;

const IconBox = styled(Center)`
  padding: ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.background.box.default.primary};
  border-radius: ${({ theme }) => theme.radius.md};
`;
