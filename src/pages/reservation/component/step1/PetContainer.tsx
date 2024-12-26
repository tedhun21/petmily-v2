import styled from 'styled-components';
import useSWRInfinite from 'swr/infinite';

import { FiMoreHorizontal } from 'react-icons/fi';

import SelectPet from './SelectPet';
import { CenterContainer } from 'styles/commonStyle';

import { infiniteFetcherWithCookie } from 'api';
import Loading from '@components/Loading';

const API_URL = process.env.REACT_APP_API_URL;

export default function PetContainer() {
  const pageSize = 6;

  const getKey = (pageIndex: number, previousPageData: any) => {
    if (previousPageData && !previousPageData.length) return null;
    return `${API_URL}/pets?page=${pageIndex + 1}&pageSize=${pageSize}`;
  };

  // 내가 가진 펫 가져오기
  const { data, size, setSize, isLoading } = useSWRInfinite(getKey, infiniteFetcherWithCookie);

  const isEmpty = data?.[0]?.results?.length === 0;
  const isEnd = data && data[data.length - 1]?.results?.length < pageSize;

  const handlePage = (e: any) => {
    e.stopPropagation();
    setSize(size + 1);
  };

  if (isLoading) {
    return (
      <CenterContainer>
        <Loading color="#279EFF" />
      </CenterContainer>
    );
  }

  if (isEmpty) {
    return (
      <CenterContainer>
        <span>펫 등록해주세요</span>
      </CenterContainer>
    );
  }

  return (
    <Container>
      {data &&
        data[0]?.results.length > 0 &&
        data?.map((page: any) => page?.results.map((pet: any) => <SelectPet key={pet.id} pet={pet} />))}
      {!isEmpty && !isEnd && (
        <button type="button" onClick={handlePage}>
          <FiMoreHorizontal color="#279EFF" size="32px" />
        </button>
      )}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
`;
