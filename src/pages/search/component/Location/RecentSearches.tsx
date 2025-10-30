import { FaXmark } from 'react-icons/fa6';
import styled from 'styled-components';
import { deleteRecentSearch } from 'utils/localStorage';

export default function RecentSearches({ data, setRecentSearches }: any) {
  const handleDeleteRecent = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();

    deleteRecentSearch('recentSearches', id);
    setRecentSearches((prev: any) => prev.filter((item: any) => item.id !== id));
  };
  return (
    <List>
      {data?.map((search: any) => (
        <Item key={search.id}>
          <span>{search.name}</span>
          <button type="button" onClick={(e) => handleDeleteRecent(e, search.id)}>
            <FaXmark />
          </button>
        </Item>
      ))}
    </List>
  );
}

const List = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Item = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 8px;
  border-radius: ${({ theme }) => theme.radius.base};
  ${({ theme }) => theme.typeScale.sm};

  &:hover {
    background-color: ${({ theme }) => theme.colors.background.highlight};
    color: ${({ theme }) => theme.colors.text.white};
  }
`;
