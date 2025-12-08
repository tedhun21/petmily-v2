import { useEffect, useRef } from 'react';
import useSWRInfinite from 'swr/infinite';
import { useSearchParams } from 'react-router-dom';

import { useInView } from 'framer-motion';

import { fetcher } from '@/api';
import Result from './Result';
import Loading from '@/components/Loading';
import Box from '@/components/styled/Box';
import Flex from '@/components/styled/Flex';
import type { Petsitter } from '@/types/user.type';

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
    <Box>
      {data && (
        <section>
          <ul>
            <Flex direction="column" gap="lg">
              {data[0].results.length > 0 &&
                Array.isArray(data[0].results) &&
                data.map((page: any) =>
                  page?.results.map((petsitter: Petsitter) => <Result key={petsitter.id} petsitter={petsitter} />),
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
