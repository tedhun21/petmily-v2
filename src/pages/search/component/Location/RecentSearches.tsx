import { FaXmark } from 'react-icons/fa6';
import { deleteRecentSearch, getRecentSearches } from '@/utils/localStorage';
import { IconButton } from '@/components/styled/IconButtonAndLink';
import Flex from '@/components/styled/Flex';
import Box from '@/components/styled/Box';
import Text from '@/components/styled/Text';
import Button from '@/components/styled/Button';
import { useState } from 'react';

type RecentLocationSearch = {
  id: number;
  name: string;
};

interface RecentSearchesProps {
  handleSetValue: (value: string, search: boolean) => void;
}

export default function RecentSearches({ handleSetValue }: RecentSearchesProps) {
  const [recentSearches, setRecentSearches] = useState(getRecentSearches('recentSearches'));

  const handleDeleteRecent = async (id: number) => {
    deleteRecentSearch('recentSearches', id);
    setRecentSearches((prev: RecentLocationSearch[]) => prev.filter((item: RecentLocationSearch) => item.id !== id));
  };
  return (
    <Flex direction="column">
      {recentSearches.length > 0 ? (
        recentSearches?.map((search: RecentLocationSearch) => (
          <Box as="li" key={search.id} p="xs" br="md">
            <Flex justifyContent="space-between" alignItems="center">
              <Button type="button" onClick={() => handleSetValue(search.name, false)} variant="transparent">
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
        ))
      ) : (
        <Text>최근 검색한 동네가 없어요</Text>
      )}
    </Flex>
  );
}
