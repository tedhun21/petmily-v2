import { fetcher, posterWithCookie } from 'api';
import { ImageCentered, RoundedImageWrapper, Texts16h24 } from 'commonStyle';
import useDebounce from 'hooks/useDebounce';

import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';

const API_URL = process.env.REACT_APP_API_URL;

export default function Results({ input }: any) {
  const navigate = useNavigate();
  const debouncedInput = useDebounce(input, 1000);

  // 검색
  const { data: searchedData } = useSWR(
    debouncedInput ? `${API_URL}/search?q=${debouncedInput}&page=1&pageSize=5` : null,
    fetcher,
  );

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

  return (
    <>
      {searchedData?.results && (
        <section>
          <span>검색 결과</span>
          <ul>
            {Array.isArray(searchedData?.results) ? (
              searchedData.results.map((result: any) => (
                <ResultItem key={result.id}>
                  <ResultButton onClick={() => handleNavigate(result)}>
                    <ResultPhoto>
                      <ImageCentered src={result.photo ? `${result.photo}` : '/imgs/DefaultUserProfile.jpg'} />
                    </ResultPhoto>
                    <ResultNickname>{result.nickname}</ResultNickname>
                  </ResultButton>
                </ResultItem>
              ))
            ) : (
              <li>검색 결과가 없습니다</li>
            )}
          </ul>
        </section>
      )}
    </>
  );
}

const ResultItem = styled.li`
  gap: 8px;
  align-items: center;
`;

const ResultButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
`;

const ResultPhoto = styled(RoundedImageWrapper)`
  width: 52px;
  height: 52px;
`;

const ResultNickname = styled(Texts16h24)``;
