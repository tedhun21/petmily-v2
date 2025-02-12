import useSWR from 'swr';
import styled from 'styled-components';
import { fetcher, fetcherWithCookie } from 'api';
import { ModalLayOut } from '../../../../components/headers/SearchBox';
import useDebounce from 'hooks/useDebounce';
import { Column, Divider, Row, Texts12h18 } from 'styles/commonStyle';

import RecentSearches from './RecentSearches';
import SuggestLocations from './SuggestLocations';
import LocationCapsuleContainer from './LocationCapsuleContainer';
import { useFormContext } from 'react-hook-form';

const API_URL = process.env.REACT_APP_API_URL;

export default function LocationModal({ selectedLocation, setSelectedLocation, handleSetValue }: any) {
  const { watch } = useFormContext();
  const debouncedInput = useDebounce(watch('location') || null, 500);

  const { data: suggestData } = useSWR(
    debouncedInput && selectedLocation !== debouncedInput
      ? `${API_URL}/search?index=locations&query=district:${debouncedInput}&size=5`
      : null,
    fetcher,
  );

  const { data: countLocations } = useSWR(`${API_URL}/search/location-count?size=12`, fetcher);
  const { data: me } = useSWR(`${API_URL}/users/me`, fetcherWithCookie);

  const handleLocationClick = (e: React.MouseEvent, searchName: string) => {
    e.stopPropagation();
    handleSetValue('location', searchName);
  };

  const hasRecentSearches = me?.recentSearches?.length > 0;

  return (
    <ModalLayOut>
      {suggestData && debouncedInput !== selectedLocation ? (
        <SuggestLocations data={suggestData} handleLocationClick={handleLocationClick} />
      ) : (
        (debouncedInput === selectedLocation || !debouncedInput) && (
          <Content>
            {hasRecentSearches && (
              <>
                <RecentContainer>
                  <RecentTitle>최근 검색 내역</RecentTitle>
                  <RecentSearches data={me.recentSearches} />
                </RecentContainer>
                <Divider $orientation="vertical" $thickness="1px" />
              </>
            )}
            {countLocations?.length > 0 && (
              <LocationCapsuleContainer data={countLocations} handleLocationClick={handleLocationClick} />
            )}
          </Content>
        )
      )}
    </ModalLayOut>
  );
}

const Content = styled(Row)`
  width: 100%;
  gap: 8px;
`;

const RecentContainer = styled(Column)`
  flex: 1;
  gap: 20px;
`;

const RecentTitle = styled(Texts12h18)``;
