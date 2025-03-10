import useSWRInfinite from 'swr/infinite';
import styled from 'styled-components';
import { fetcher } from 'api';
import Result from './Result';
import { CenterContainer } from 'styles/commonStyle';
import Loading from '@components/Loading';
import { useEffect, useRef } from 'react';
import { useInView } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL;

export default function Results() {
  const [searchParams] = useSearchParams();
  const ref = useRef(null);
  const isInView = useInView(ref);

  const pageSize = 10;
  const getKey = (pageIndex: number, previousPageData: any) => {
    if (!searchParams || Array.from(searchParams).length === 0) return null;
    if (previousPageData && !previousPageData.length) return null;
    return `${API_URL}/users/petsitters/possible?${searchParams}&page=${pageIndex + 1}&pageSize=${pageSize}`;
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
      <AlternativeContainer>
        <span>펫시터를 찾을 수 없습니다</span>
      </AlternativeContainer>
    );
  }

  if (isLoading) {
    return (
      <AlternativeContainer>
        <Loading color="#279EFF" />
      </AlternativeContainer>
    );
  }

  return (
    <Main>
      {data && (
        <section>
          <ResultsList>
            {data[0].results.length > 0 &&
              Array.isArray(data[0].results) &&
              data.map((page: any) =>
                page?.results.map((petsitter: any) => <Result key={petsitter.id} petsitter={petsitter} />),
              )}
          </ResultsList>
        </section>
      )}

      {data && !isEnd && (
        <CenterContainer ref={ref}>
          <Loading color="#279EFF" />
        </CenterContainer>
      )}
    </Main>
  );
}

const Main = styled.main`
  padding: 12px;
  height: 100%;
`;

const AlternativeContainer = styled(CenterContainer)`
  height: 100%;
`;

const ResultsList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;
