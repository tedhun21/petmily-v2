import styled from 'styled-components';

export default function RecentSearches({ data }: any) {
  return <List>{data?.map((search: any) => <Item key={search.id}>{search.name}</Item>)}</List>;
}

const List = styled.ul`
  display: flex;
  gap: 8px;
`;

const Item = styled.li`
  display: flex;
  justify-content: space-between;
  padding: 4px 8px;
  border-radius: ${({ theme }) => theme.radius.normal};
  ${({ theme }) => theme.fontSize.s14h21};

  &:hover {
    background-color: red;
  }
`;
