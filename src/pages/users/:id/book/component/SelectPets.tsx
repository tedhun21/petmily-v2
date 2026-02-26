import { fetcher } from '@/api';
import { useAuthSWRInfinite } from '@/hooks/authSWR';
import { FiMoreHorizontal } from 'react-icons/fi';
import PetItem from './PetItem';
import type { Pet } from '@/types/pet.type';
import Flex from '@/components/styled/Flex';
import type { OffsetResponse } from '@/types/common.type';

export default function SelectPets() {
  const pageSize = 6;

  const getKey = (pageIndex: number, previousPageData: OffsetResponse<Pet> | null) => {
    if (previousPageData && previousPageData.results.length === 0) return null;
    return `/pets?page=${pageIndex + 1}&pageSize=${pageSize}`;
  };

  const { data, size, setSize, error } = useAuthSWRInfinite(getKey, fetcher);
  const isEnd = data && data[data.length - 1]?.results?.length < pageSize;

  if (error) {
    return (
      <Flex justifyContent="center" alignItems="center">
        <span>Failed to load pets.</span>
      </Flex>
    );
  }

  return (
    <>
      {data && data[0].results?.length > 0 && (
        <Flex as="ul" gap="lg">
          {data &&
            data[0].results?.length > 0 &&
            data?.map((page) => page?.results.map((pet: Pet) => <PetItem key={pet.id} pet={pet} />))}

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
