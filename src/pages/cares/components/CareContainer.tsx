import { useEffect, useRef } from 'react';

import { useSelector } from 'react-redux';
import { useAuthSWRInfinite } from '@/hooks/authSWR';
import { useInView } from 'framer-motion';

import Spinner from '@/components/Spinner';
import Box from '@/components/styled/Box';
import Flex from '@/components/styled/Flex';
import CareCard from './CareCard';
import type { RootState } from '@/store';
import { fetcher } from '@/api';
import type { Reservation } from '@/types/reservation.type';

export default function CareContainer() {
  const ref = useRef(null);
  const isInView = useInView(ref);
  const pageSize = 10;

  const {
    reservation: { month, filter },
  } = useSelector((state: RootState) => state.context);

  const getKey = (pageIndex: number, previousPageData: any) => {
    if (previousPageData && !previousPageData.length) return null;
    return filter && month
      ? `/reservations?page=${pageIndex + 1}&pageSize=${pageSize}&status=${filter}&date=${month}`
      : null;
  };
  const { data, size, setSize, isLoading } = useAuthSWRInfinite(getKey, fetcher);

  const isEmpty = data?.[0]?.results?.length === 0;
  const isEnd = data && data[data.length - 1]?.results?.length < pageSize;

  useEffect(() => {
    if (isInView) {
      setSize(size + 1);
    }
  }, [isInView]);

  if (isLoading) {
    return (
      <Flex justifyContent="center" alignItems="center">
        <Spinner color="#279EFF" />
      </Flex>
    );
  }

  if (isEmpty) {
    return (
      <Flex justifyContent="center" alignItems="center">
        <span>No Reservation</span>
      </Flex>
    );
  }

  return (
    <Box>
      <Flex direction="column" gap="lg">
        {data &&
          data[0]?.results.length > 0 &&
          data?.map((page: any) =>
            page?.results.map((reservation: Reservation) => (
              <CareCard key={reservation.id} reservation={reservation} />
            )),
          )}

        {data && !isEnd && (
          <div ref={ref}>
            <Flex justifyContent="center" alignItems="center">
              <Spinner color="#279EFF" />
            </Flex>
          </div>
        )}
      </Flex>
    </Box>
  );
}
