import { useState } from 'react';

import useSWR from 'swr';
import { useFormContext } from 'react-hook-form';

import { fetcher } from '@/api';
import { useDebounceValue } from '@/hooks/useDebounce';
import { Divider } from '@/styles/commonStyle';
import RecentSearches from './RecentSearches';
import SuggestLocations from './SuggestLocations';
import LocationCapsuleContainer from './LocationCapsuleContainer';
import Spinner from '@/components/Spinner';
import { ModalLayOut, HalfModalLayOut, type FormValues } from '@/pages/search/component/SearchBox';
import { getRecentSearches } from '@/utils/localStorage';
import Text from '@/components/styled/Text';
import Box from '@/components/styled/Box';
import Flex from '@/components/styled/Flex';

interface LocationModalProps {
  handleSetValue: (field: keyof FormValues, value: string) => void;
}

export default function LocationModal({ handleSetValue }: LocationModalProps) {
  const { getValues, watch } = useFormContext();
  const inputValue = watch('location') || '';
  const debouncedInput = useDebounceValue(inputValue, 500);

  // 이전에 선택했던 위치 (예: URL에서 가져온 값 혹은 이전 입력값)
  const [selectedLocation, setSelectedLocation] = useState(getValues('location') || '');

  const [recentSearches, setRecentSearches] = useState(getRecentSearches('recentSearches'));

  // debouncedInput과 선택된 위치가 다르면, 검색을 수행해야 한다.
  const shouldFetchSuggestions = debouncedInput !== selectedLocation;

  // debouncedInput을 바로 검색 쿼리로 사용 (빈 문자열이어도 API에서 처리할 수 있다면)
  const { data: suggestData, isLoading: isSuggestDataLoading } = useSWR(
    shouldFetchSuggestions ? `/search?index=locations&query=district:${debouncedInput}&size=5` : null,
    fetcher,
  );

  const { data: countLocations } = useSWR('/search/location-count?size=12', fetcher);

  const handleLocationClick = (searchName: string) => {
    setSelectedLocation(searchName);
    // 선택하면 입력값과 달라진 상태를 초기화해 불필요한 재검색을 막음
    handleSetValue('location', searchName);
  };

  return (
    <>
      {shouldFetchSuggestions && debouncedInput?.length > 0 ? (
        <HalfModalLayOut>
          {isSuggestDataLoading ? (
            <Box>
              <Spinner />
            </Box>
          ) : (
            <SuggestLocations data={suggestData} handleLocationClick={handleLocationClick} />
          )}
        </HalfModalLayOut>
      ) : (
        <ModalLayOut>
          <Flex gap="sm">
            {recentSearches?.length > 0 && (
              <Flex gap="xs">
                <Flex direction="column" gap="xl">
                  <Text size="xs">최근 검색 내역</Text>
                  <RecentSearches
                    data={recentSearches}
                    handleLocationClick={handleLocationClick}
                    setRecentSearches={setRecentSearches}
                  />
                </Flex>
                <Divider $orientation="vertical" $thickness="1px" />
              </Flex>
            )}
            {countLocations?.length > 0 && (
              <LocationCapsuleContainer data={countLocations} handleLocationClick={handleLocationClick} />
            )}
          </Flex>
        </ModalLayOut>
      )}
    </>
  );
}
