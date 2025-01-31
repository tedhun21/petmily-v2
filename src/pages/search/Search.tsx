import styled from 'styled-components';

import Results from './component/Results';
import SearchBox from './component/SearchBox';
import NavHeader from '@components/headers/NavHeader';

export default function Search() {
  return (
    <>
      <NavHeader />
      <Main>
        {/* input */}
        {/* <SearchInput input={input} setInput={setInput} /> */}

        <SearchBox />

        {/* 검색 결과 */}
        <Results />

        {/* 최근 검색어 */}
        {/* <RecentSearches input={input} /> */}
      </Main>
    </>
  );
}

const Main = styled.main`
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
  padding: 12px;
`;
