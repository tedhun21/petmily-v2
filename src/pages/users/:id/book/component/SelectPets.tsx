import { fetcher } from 'api';
import { SubTitle } from 'styles/commonStyle';
import { useAuthSWRInfinite } from 'hooks/authSWR';
import PetItem from './PetItem';
import { Pet } from 'types/pet.type';
import { FiMoreHorizontal } from 'react-icons/fi';
import { Flex } from '@components/Flex';

export default function SelectPets() {
  const pageSize = 6;

  const getKey = (pageIndex: number, previousPageData: any) => {
    if (previousPageData && previousPageData.results.length === 0) return null;
    return `/pets?page=${pageIndex + 1}&pageSize=${pageSize}`;
  };

  // 내가 가진 펫 가져오기
  const { data, size, setSize, isLoading } = useAuthSWRInfinite(getKey, fetcher);

  const isEmpty = data?.[0]?.results?.length === 0;
  const isEnd = data && data[data.length - 1]?.results?.length < pageSize;

  return (
    <>
      <SubTitle>펫 선택</SubTitle>
      {data && data[0].results?.length > 0 && (
        <Flex as="ul" direction="column" gap="lg">
          {data &&
            data[0].results?.length > 0 &&
            data?.map((page: any) => page?.results.map((pet: Pet) => <PetItem key={pet.id} pet={pet} />))}
          {!isEnd && (
            <Flex justifyContent="center" alignItems="center">
              <button onClick={() => setSize(size + 1)}>
                <FiMoreHorizontal size="40px" color="#279EFF" />
              </button>
            </Flex>
          )}
        </Flex>
      )}
    </>
  );
}
