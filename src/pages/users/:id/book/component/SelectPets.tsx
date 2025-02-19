import { fetcherWithCookie } from 'api';
import { CenterContainer, SubTitle } from 'styles/commonStyle';
import styled from 'styled-components';
import useSWRInfinite from 'swr/infinite';
import PetItem from './PetItem';
import { Pet } from 'types/pet.type';
import { FiMoreHorizontal } from 'react-icons/fi';

const API_URL = process.env.REACT_APP_API_URL;

export default function SelectPets() {
  const pageSize = 6;

  const getKey = (pageIndex: number, previousPageData: any) => {
    if (previousPageData && previousPageData.results.length === 0) return null;
    return `${API_URL}/pets?page=${pageIndex + 1}&pageSize=${pageSize}`;
  };

  // 내가 가진 펫 가져오기
  const { data, size, setSize, isLoading } = useSWRInfinite(getKey, fetcherWithCookie);

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
              data?.map((page: any) => page?.results.map((pet: Pet) => <PetItem key={pet.id} pet={pet} />))}
            {!isEnd && (
              <CenterContainer>
                <button onClick={() => setSize(size + 1)}>
                  <FiMoreHorizontal size="40px" color="#279EFF" />
                </button>
              </CenterContainer>
            )}
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
