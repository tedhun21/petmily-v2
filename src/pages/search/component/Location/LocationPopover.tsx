import { Divider } from '@/styles/commonStyle';
import RecentSearches from './RecentSearches';
import SuggestLocations from './SuggestLocations';
import LocationCapsuleContainer from './LocationCapsuleContainer';
import Spinner from '@/components/Spinner';
import Text from '@/components/styled/Text';
import Box from '@/components/styled/Box';
import Flex from '@/components/styled/Flex';
import useSWR from 'swr';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useDebounceValue } from '@/hooks/useDebounce';
import { fetcher } from '@/api';

interface LocationPopoverProps {
  shouldSearch: React.RefObject<boolean | null>;
  handleSetValue: (value: string, search: boolean) => void;
}

export default function LocationPopover({ shouldSearch, handleSetValue }: LocationPopoverProps) {
  const { watch } = useFormContext();

  const [searchQuery, setSearchQuery] = useState('');
  const inputValue = watch('location') || '';
  const debouncedInput = useDebounceValue(inputValue, 500);

  useEffect(() => {
    if (debouncedInput && shouldSearch.current) {
      setSearchQuery(debouncedInput);
    } else {
      setSearchQuery('');
    }
  }, [debouncedInput, shouldSearch]);

  const { data: suggestData, isLoading: isSuggestDataLoading } = useSWR(
    searchQuery ? `/search?index=locations&query=district:${searchQuery}&size=5` : null,
    fetcher,
  );

  const { data: countLocations } = useSWR('/search/location-count?size=12', fetcher);

  const showSuggestions = suggestData && suggestData.length > 0 && !isSuggestDataLoading;

  return (
    <>
      {showSuggestions ? (
        <>
          {isSuggestDataLoading ? (
            <Box>
              <Spinner />
            </Box>
          ) : (
            <SuggestLocations data={suggestData} handleSetValue={handleSetValue} />
          )}
        </>
      ) : (
        <Flex gap="sm">
          <Flex gap="xs">
            <Flex direction="column" gap="xl">
              <Text size="xs">최근 검색 내역</Text>
              <RecentSearches handleSetValue={handleSetValue} />
            </Flex>
            {countLocations?.length > 0 && (
              <>
                <Divider $orientation="vertical" $thickness="1px" />
                <LocationCapsuleContainer data={countLocations} handleSetValue={handleSetValue} />
              </>
            )}
          </Flex>
        </Flex>
      )}
    </>
  );
}
