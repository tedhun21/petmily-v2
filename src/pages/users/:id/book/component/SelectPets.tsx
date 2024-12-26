import { infiniteFetcherWithCookie } from 'api';
import { SubTitle } from 'styles/commonStyle';
import styled from 'styled-components';
import useSWRInfinite from 'swr/infinite';
import PetItem from './PetItem';

const API_URL = process.env.REACT_APP_API_URL;

export default function SelectPets() {
  const pageSize = 6;

  const getKey = (pageIndex: number, previousPageData: any) => {
    if (previousPageData && !previousPageData.length) return null;
    return `${API_URL}/pets?page=${pageIndex + 1}&pageSize=${pageSize}`;
  };

  // 내가 가진 펫 가져오기
  const { data, size, setSize, isLoading } = useSWRInfinite(getKey, infiniteFetcherWithCookie);

  const isEmpty = data?.[0]?.results?.length === 0;
  const isEnd = data && data[data.length - 1]?.results?.length < pageSize;

  return (
    <>
      {data && data[0].results?.length > 0 && (
        <Section>
          <SubTitle>펫 선택</SubTitle>
          <List>
            {data &&
              data[0].results?.length > 0 &&
              data?.map((page: any) => page?.results.map((pet: any) => <PetItem key={pet.id} pet={pet} />))}
          </List>
        </Section>
      )}
    </>
  );
}

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const List = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
`;
