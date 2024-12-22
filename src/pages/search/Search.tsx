import { useState } from 'react';
import styled from 'styled-components';

import { Texts20h30 } from 'commonStyle';
import SearchInput from './component/SearchInput';
import RecentSearches from './component/RecentSearches';
import Results from './component/Results';
import SearchBox from './component/SearchBox';
import { FormProvider, useForm } from 'react-hook-form';
import useSWRInfinite from 'swr/infinite';
import { infiniteFetcher } from 'api';
import dayjs from 'dayjs';

const API_URL = process.env.REACT_APP_API_URL;

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
