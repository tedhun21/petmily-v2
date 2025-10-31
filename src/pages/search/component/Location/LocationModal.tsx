import { useEffect, useState } from 'react';

import useSWR from 'swr';
import styled from 'styled-components';
import { useFormContext } from 'react-hook-form';

import { fetcher } from 'api';
import { useDebounceValue } from 'hooks/useDebounce';
import { CenterContainer, Column, Divider, Row, Texts12h16 } from 'styles/commonStyle';
import RecentSearches from './RecentSearches';
import SuggestLocations from './SuggestLocations';
import LocationCapsuleContainer from './LocationCapsuleContainer';
import Loading from '@components/Loading';
import { ModalLayOut, HalfModalLayOut, FormValues } from '@pages/search/component/SearchBox';
import { getRecentSearches } from 'utils/localStorage';

interface LocationModalProps {
  handleSetValue: (field: keyof FormValues, value: any) => void;
}

export default function LocationModal({ handleSetValue }: LocationModalProps) {
  const { getValues, watch } = useFormContext();
  // 입력값을 가져오고 디바운스 처리 (빈 문자열이면 '')
  const inputValue = watch('location') || '';
  const debouncedInput = useDebounceValue(inputValue, 500);

  // 이전에 선택했던 위치 (예: URL에서 가져온 값 혹은 이전 입력값)
  const [selectedLocation, setSelectedLocation] = useState(getValues('location') || '');
  // 최근 검색어 localStorage에서 불러오기
  const [recentSearches, setRecentSearches] = useState([]);

  // debouncedInput과 선택된 위치가 다르면, 검색을 수행해야 한다.
  const shouldFetchSuggestions = debouncedInput !== selectedLocation;

  // debouncedInput을 바로 검색 쿼리로 사용 (빈 문자열이어도 API에서 처리할 수 있다면)
  const { data: suggestData, isLoading: isSuggestDataLoading } = useSWR(
    shouldFetchSuggestions ? `/search?index=locations&query=district:${debouncedInput}&size=5` : null,
    fetcher,
  );

  const { data: countLocations } = useSWR('/search/location-count?size=12', fetcher);

  const handleLocationClick = (e: React.MouseEvent, searchName: string) => {
    e.stopPropagation();
    setSelectedLocation(searchName);
    // 선택하면 입력값과 달라진 상태를 초기화해 불필요한 재검색을 막음
    handleSetValue('location', searchName);
  };

  useEffect(() => {
    setRecentSearches(getRecentSearches('recentSearches'));
  }, []);

  return (
    <>
      {shouldFetchSuggestions && debouncedInput?.length > 0 ? (
        <HalfModalLayOut>
          {isSuggestDataLoading ? (
            <AlternativeContainer>
              <Loading />
            </AlternativeContainer>
          ) : (
            <SuggestLocations data={suggestData} handleLocationClick={handleLocationClick} />
          )}
        </HalfModalLayOut>
      ) : (
        <ModalLayOut>
          <Content>
            {recentSearches?.length > 0 && (
              <RecentContainer>
                <RecentWrapper>
                  <RecentTitle>최근 검색 내역</RecentTitle>
                  <RecentSearches data={recentSearches} setRecentSearches={setRecentSearches} />
                </RecentWrapper>
                <Divider $orientation="vertical" $thickness="1px" />
              </RecentContainer>
            )}
            {countLocations?.length > 0 && (
              <LocationCapsuleContainer data={countLocations} handleLocationClick={handleLocationClick} />
            )}
          </Content>
        </ModalLayOut>
      )}
    </>
  );
}

const AlternativeContainer = styled(CenterContainer)`
  width: 100%;
  height: 300px;
`;

const Content = styled(Row)`
  width: 100%;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const RecentContainer = styled(Row)`
  display: flex;
  flex: 0 0 auto;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const RecentWrapper = styled(Column)`
  flex: 1;
  gap: ${({ theme }) => theme.spacing.xl};
`;

const RecentTitle = styled(Texts12h16)``;
