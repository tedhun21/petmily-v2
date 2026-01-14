import { FaXmark } from 'react-icons/fa6';
import { deleteRecentSearch } from '@/utils/localStorage';
import { IconButton } from '@/components/styled/IconButtonAndLink';
import Flex from '@/components/styled/Flex';
import Box from '@/components/styled/Box';
import Text from '@/components/styled/Text';
import Button from '@/components/styled/Button';

type RecentLocationSearch = {
  id: number;
  name: string;
};

interface IProps {
  data: RecentLocationSearch[];
  handleLocationClick: (searchName: string) => void;
  setRecentSearches: React.Dispatch<React.SetStateAction<RecentLocationSearch[]>>;
}

export default function RecentSearches({ data, handleLocationClick, setRecentSearches }: IProps) {
  const handleDeleteRecent = async (id: number) => {
    deleteRecentSearch('recentSearches', id);
    setRecentSearches((prev: RecentLocationSearch[]) => prev.filter((item: RecentLocationSearch) => item.id !== id));
  };
  return (
    <Flex direction="column">
      {data?.map((search: RecentLocationSearch) => (
        <Box as="li" key={search.id} p="xs" br="md">
          <Flex justifyContent="space-between" alignItems="center">
            <Button type="button" onClick={() => handleLocationClick(search.name)} variant="transparent">
              <Text size="sm">{search.name}</Text>
            </Button>
            <IconButton
              type="button"
              onClick={() => handleDeleteRecent(search.id)}
              variant="clear"
              shape="circle"
              size="sm"
            >
              <FaXmark size="16px" />
            </IconButton>
          </Flex>
        </Box>
      ))}
    </Flex>
  );
}
