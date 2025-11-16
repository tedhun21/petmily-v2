import useSWRInfinite from 'swr/infinite';
import { fetcher } from 'api';
import Result from './Result';
import Loading from '@components/Loading';
import { useEffect, useRef } from 'react';
import { useInView } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import Box from '@components/Box';
import { Flex } from '@components/Flex';

export default function Results() {
  const [searchParams] = useSearchParams();
  const ref = useRef(null);
  const isInView = useInView(ref);

  const pageSize = 10;
  const getKey = (pageIndex: number, previousPageData: any) => {
    if (!searchParams || Array.from(searchParams).length === 0) return null;
    if (previousPageData && !previousPageData.length) return null;
    return `/users/petsitters/possible?${searchParams}&page=${pageIndex + 1}&pageSize=${pageSize}`;
  };

  const { isLoading, data, size, setSize } = useSWRInfinite(getKey, fetcher);

  const isEmpty = data?.[0]?.results?.length === 0;
  const isEnd = data && data[data.length - 1]?.results?.length < pageSize;

  useEffect(() => {
    if (isInView) {
      setSize(size + 1);
    }
  }, [isInView]);

  if (isEmpty) {
    return (
      <Flex justifyContent="center" alignItems="center">
        <span>펫시터를 찾을 수 없습니다</span>
      </Flex>
    );
  }

  if (isLoading) {
    return (
      <Flex justifyContent="center" alignItems="center">
        <Loading color="#279EFF" />
      </Flex>
    );
  }

  return (
    <Box h="100%" p="md">
      {data && (
        <section>
          <ul>
            <Flex direction="column" gap="lg">
              {data[0].results.length > 0 &&
                Array.isArray(data[0].results) &&
                data.map((page: any) =>
                  page?.results.map((petsitter: any) => <Result key={petsitter.id} petsitter={petsitter} />),
                )}
            </Flex>
          </ul>
        </section>
      )}

      {data && !isEnd && (
        <Flex justifyContent="center" alignItems="center">
          <Loading color="#279EFF" />
        </Flex>
      )}
    </Box>
  );
}
