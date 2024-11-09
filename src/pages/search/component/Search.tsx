import { ChangeEvent, useState } from 'react';
import styled from 'styled-components';

import { FaXmark } from 'react-icons/fa6';
import { FiSearch } from 'react-icons/fi';

import { Texts20h30 } from 'commonStyle';
import Results from './Results';
import RecentSearches from './RecentSearches';
import SearchInput from '../SearchInput';

export default function Search() {
  const [isFocused, setIsFocused] = useState(false);

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
  color: ${(props) => props.theme.textColors.gray10};
  font-weight: ${(props) => props.theme.fontWeights.extrabold};
`;

const InputContainer = styled.div<{ isFocused: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border: 2px solid ${(props) => props.theme.colors.mainBlue};
  border-radius: 20px;

  &:hover {
    border-color: ${(props) => props.theme.colors.subBlue};
  }

  &:focus-within {
    border-color: ${(props) => props.theme.colors.darkBlue};
  }
`;
