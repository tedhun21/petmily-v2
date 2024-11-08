import { ChangeEvent, useState } from 'react';
import styled from 'styled-components';

import { ImageCentered, RoundedImageWrapper, Texts20h30 } from 'commonStyle';

import { FiSearch } from 'react-icons/fi';

import { fetcher, fetcherWithCookie, posterWithCookie } from 'api';
import { FaXmark } from 'react-icons/fa6';
import Results from './Results';
import useDebounce from 'hooks/useDebounce';
import useSWR from 'swr';
import { useNavigate } from 'react-router-dom';
import useSWRMutation from 'swr/mutation';
import { Link } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL;

export default function Search() {
  const navigate = useNavigate();
  const [showResults, setShowResults] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const [input, setInput] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string | null>(null);

  const handleClearInput = () => {
    setInput('');
  };

  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.currentTarget.value);
  };

  const debouncedInput = useDebounce(input, 1000);

  // 검색
  const { data: searchedData } = useSWR(
    debouncedInput ? `${API_URL}/search?q=${debouncedInput}&page=1&pageSize=5` : null,
    fetcher,
  );

  // 최근 검색어 가져오기
  const { data: recentData } = useSWR(`${API_URL}/search/recent`, fetcherWithCookie);

  // 최근 검색어 등록
  const { trigger } = useSWRMutation(`${API_URL}/search/recent`, posterWithCookie);

  // 최근 검색어 저장, 링크
  const handleNavigate = (e: any) => {
    const { id, nickname, role } = e;
    if (role) {
      trigger({ formData: { id, type: 'User' } });
    }
    navigate(`/users/${nickname}`);
  };

  console.log(recentData);

  return (
    <SearchContainer>
      <SearchTitleText>펫시터 검색</SearchTitleText>

      {/* input */}
      <InputContainer isFocused={isFocused}>
        <FiSearch size="28px" color="#237EFF" />
        <SearchInput
          placeholder="검색"
          value={input}
          onChange={handleChangeInput}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {input && (
          <button type="button" onClick={handleClearInput}>
            <FaXmark size="20px" />
          </button>
        )}
      </InputContainer>

      {/* 최근 검색어 */}
      {recentData && input.length === 0 && (
        <div>
          <span>최근 검색어</span>
          <ul>
            {Array.isArray(recentData) ? (
              recentData.map((recent: any, index: number) => {
                if (recent.type === 'User') {
                  return (
                    <li key={index}>
                      <RecentLink to={`/users/${recent.nickname}`}>
                        <ResultPhoto>
                          <ImageCentered src={recent.photo ? `${recent.photo}` : '/imgs/DefaultUserProfile.jpg'} />
                        </ResultPhoto>
                        <span>{recent.nickname}</span>
                      </RecentLink>
                    </li>
                  );
                }
              })
            ) : (
              <li>최근 검색어가 없습니다</li>
            )}
          </ul>
        </div>
      )}

      {/* 검색 결과 */}
      {searchedData?.results && (
        <div>
          <span>검색 결과</span>
          <ul>
            {Array.isArray(searchedData?.results) ? (
              searchedData.results.map((result: any) => (
                <ResultItem key={result.id}>
                  <button onClick={() => handleNavigate(result)}>
                    <ResultPhoto>
                      <ImageCentered src={result.photo ? `${result.photo}` : '/imgs/DefaultUserProfile.jpg'} />
                    </ResultPhoto>
                    <span>{result.nickname}</span>
                  </button>
                </ResultItem>
              ))
            ) : (
              <li>검색 결과가 없습니다</li>
            )}
          </ul>
        </div>
      )}

      {/* <div>
        <span>최근 검색어</span>
      </div> */}

      {showResults && <Results searchTerm={searchTerm} />}
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

const SearchInput = styled.input`
  flex: auto;
  width: 100%;
  border: none;

  &:focus {
    outline: none;
  }
  focus: none;
  ${(props) => props.theme.fontSize.s18h27};
`;

const ResultItem = styled.li`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const RecentLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 8px;

  color: inherit; /* 텍스트 색상을 부모 요소와 동일하게 설정 */

  &:visited,
  &:hover,
  &:active {
    text-decoration: none;
    color: inherit; /* 각 상태에서 동일한 색상을 유지 */
  }
`;

const ResultPhoto = styled(RoundedImageWrapper)`
  width: 40px;
  height: 40px;
`;

const RecommendContainer = styled.div`
  margin-top: 20px;
  margin-bottom: 12px;
`;

const RecommendText = styled.div`
  ${(props) => props.theme.fontSize.s14h21};
`;

const SearchBody = styled.div`
  margin: 44px 40px 0;
`;

const ResultContainer = styled.div``;

const ResultText = styled.div`
  ${(props) => props.theme.fontSize.s20h30};
  color: #595959;
  font-weight: ${(props) => props.theme.fontWeights.extrabold};
`;
