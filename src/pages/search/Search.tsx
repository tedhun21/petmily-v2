import styled from 'styled-components';

import Results from './component/Results';
import SearchBox from './component/SearchBox';

export default function Search() {
  return (
    <SearchContainer>
      {/* input */}
      {/* <SearchInput input={input} setInput={setInput} /> */}

      <SearchBox />

      {/* 검색 결과 */}
      <Results />

      {/* 최근 검색어 */}
      {/* <RecentSearches input={input} /> */}
    </SearchContainer>
  );
}

const SearchContainer = styled.main`
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
  padding: 12px;
`;
