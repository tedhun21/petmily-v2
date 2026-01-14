import { Fragment, useEffect } from 'react';
import useSWRInfinite from 'swr/infinite';
import { useSearchParams } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';

import { fetcher } from '@/api';
import Result from './Result';
import Spinner from '@/components/Spinner';
import Box from '@/components/styled/Box';
import Flex from '@/components/styled/Flex';
import type { Petsitter } from '@/types/user.type';

const PAGE_SIZE = 10;

export default function Results() {
  const [searchParams] = useSearchParams();

  const { ref, inView } = useInView();

  const getKey = (pageIndex: number, previousPageData: any) => {
    if (!searchParams || Array.from(searchParams).length === 0) return null;

    if (previousPageData && previousPageData.results.length === 0) return null;

    return `/users/petsitters/possible?${searchParams}&page=${pageIndex + 1}&pageSize=${PAGE_SIZE}`;
  };

  const { isLoading, isValidating, data, setSize } = useSWRInfinite(getKey, fetcher);

  const isEmpty = data?.[0]?.results?.length === 0;
  const lastPage = data?.[data.length - 1];
  const isEnd = lastPage?.pagination ? lastPage.pagination.page >= lastPage.pagination.totalPages : false;

  useEffect(() => {
    if (inView && !isEnd && !isValidating) {
      setSize((prev) => prev + 1);
    }
  }, [inView, isEnd, isValidating, setSize]);

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
        <Spinner color="#279EFF" />
      </Flex>
    );
  }

  return (
    <Box>
      {data && (
        <section>
          <ul>
            <Flex direction="column" gap="lg">
              {data.map((page, index) => (
                <Fragment key={index}>
                  {page.results.map((petsitter: Petsitter) => (
                    <Result key={petsitter.id} petsitter={petsitter} />
                  ))}
                </Fragment>
              ))}
            </Flex>
          </ul>
        </section>
      )}

      {data && !isEnd && (
        <Flex justifyContent="center" alignItems="center">
          <Spinner ref={ref} color="#279EFF" />
        </Flex>
      )}
    </Box>
  );
}
