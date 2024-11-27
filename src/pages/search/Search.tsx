import { useState } from 'react';
import styled from 'styled-components';

import { Texts20h30 } from 'commonStyle';
import SearchInput from './component/SearchInput';
import RecentSearches from './component/RecentSearches';
import Results from './component/Results';

export default function Search() {
  const [input, setInput] = useState<string>('');

  return (
    <SearchContainer>
      <SearchTitleText>펫시터 검색</SearchTitleText>

      {/* input */}
      <SearchInput input={input} setInput={setInput} />

      {/* 최근 검색어 */}
      <RecentSearches input={input} />

      {/* 검색 결과 */}
      <Results input={input} />
    </SearchContainer>
  );
}

const SearchContainer = styled.main`
  display: flex;
  flex-direction: column;
  overflow: auto;
  gap: 16px;
  padding: 12px;
`;

const SearchTitleText = styled(Texts20h30)`
  color: ${({ theme }) => theme.text.active};
  font-weight: ${({ theme }) => theme.fontWeight.extrabold};
`;
