import { infiniteFetcher } from 'api';
import { useEffect } from 'react';
import useSWRMutation from 'swr/mutation';

const API_URL = process.env.REACT_APP_API_URL;

export default function Results({ searchTerm }: any) {
  const pageSize = 20;

  const getKey = (pageIndex: number, previousPageData: any) => {
    if (previousPageData && !previousPageData.length) return null;
    return `${API_URL}/search?q=${searchTerm}&page=${pageIndex + 1}&pageSize=${pageSize}`;
  };

  const { trigger, data } = useSWRMutation(`${API_URL}/search?q=${searchTerm}`, infiniteFetcher);

  useEffect(() => {}, [searchTerm]);

  return (
    <section>
      <span>검색 결과</span>
      <div>
        <ul>{data.results.map((page: any) => page.map((result: any) => result.id))}</ul>
      </div>
    </section>
  );
}
