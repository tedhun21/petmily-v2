import { fetcherWithCookie } from 'api';
import { ImageCentered, RoundedImageWrapper } from 'commonStyle';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import useSWR from 'swr';

const API_URL = process.env.REACT_APP_API_URL;

export default function RecentSearches({ input }: any) {
  // 최근 검색어 가져오기
  const { data: recentData } = useSWR(`${API_URL}/search/recent`, fetcherWithCookie);
  return (
    <>
      {recentData && input.length === 0 && (
        <section>
          <span>최근 검색어</span>
          <List>
            {Array.isArray(recentData) ? (
              recentData.map((recent: any, index: number) => {
                // 유저 타입 검색만  구현
                if (recent.type === 'User') {
                  return (
                    <ListItem key={index}>
                      <RecentLink to={`/users/${recent.nickname}`}>
                        <ResultPhoto>
                          <ImageCentered src={recent.photo ? `${recent.photo}` : '/imgs/DefaultUserProfile.jpg'} />
                        </ResultPhoto>
                        <span>{recent.nickname}</span>
                      </RecentLink>
                    </ListItem>
                  );
                }
              })
            ) : (
              <li>최근 검색어가 없습니다</li>
            )}
          </List>
        </section>
      )}
    </>
  );
}

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

const List = styled.ul`
  display: flex;
  flex-direction: column;
`;

const ListItem = styled.li`
  dislplay: flex;
  flex-direction: row;
  padding: 8px;
`;

const ResultPhoto = styled(RoundedImageWrapper)`
  width: 52px;
  height: 52px;
`;
