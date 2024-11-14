import { deleterWithCookie, fetcherWithCookie, posterWithCookie, updaterWithCookie } from 'api';
import { CenterContainer, ImageCentered, RoundedImageWrapper, Row, Texts18h27 } from 'commonStyle';
import { FaXmark } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';

const API_URL = process.env.REACT_APP_API_URL;

export default function RecentSearches({ input }: any) {
  // 최근 검색어 가져오기
  const { data: recentData, mutate } = useSWR(`${API_URL}/search/recent`, fetcherWithCookie);

  // 최근 검색어 삭제
  const { trigger } = useSWRMutation(`${API_URL}/search/recent/delete`, updaterWithCookie);

  // trigger 성공하면 optimistic update
  const handleRecentSearchDelete = async (data: any) => {
    try {
      // API 요청 수행
      await trigger({ formData: { id: data.id, type: data.type } });

      // 삭제가 성공한 경우에만 캐시 업데이트
      mutate((currentData: any) => currentData?.filter((item: any) => item.id !== data.id), { revalidate: false });
    } catch (e) {
      console.error('삭제 실패:', e);
    }
  };

  return (
    <>
      {recentData && input.length === 0 && (
        <Section>
          <span>최근 검색어</span>
          {recentData.length > 0 ? (
            <List>
              {Array.isArray(recentData) &&
                recentData.map((recent: any, index: number) => {
                  // 유저 타입 검색만  구현
                  if (recent.type === 'User') {
                    return (
                      <ListItem key={index}>
                        <RecentLink to={`/users/${recent.nickname}`}>
                          <ResultPhotoName>
                            <ResultPhoto>
                              <ImageCentered src={recent.photo ? `${recent.photo}` : '/imgs/DefaultUserProfile.jpg'} />
                            </ResultPhoto>
                            <ResultName>{recent.nickname}</ResultName>
                          </ResultPhotoName>
                        </RecentLink>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation(); // 이벤트 버블링 방지
                            handleRecentSearchDelete(recent);
                          }}
                        >
                          <FaXmark size="20px" />
                        </button>
                      </ListItem>
                    );
                  }
                })}
            </List>
          ) : (
            <CenterContainer>최근 검색어가 없습니다</CenterContainer>
          )}
        </Section>
      )}
    </>
  );
}

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const List = styled.ul`
  display: flex;
  flex-direction: column;
`;

const ListItem = styled.li`
  display: flex;
  justify-content: space-between;
  padding: 8px;
`;

const RecentLink = styled(Link)`
  display: flex;
  align-items: center;
  padding: 4px;
  gap: 8px;
  color: inherit; /* 텍스트 색상을 부모 요소와 동일하게 설정 */

  &:visited,
  &:hover,
  &:active {
    text-decoration: none;
    color: inherit; /* 각 상태에서 동일한 색상을 유지 */
  }
`;

const ResultPhotoName = styled(Row)`
  align-items: center;
  gap: 8px;
`;

const ResultPhoto = styled(RoundedImageWrapper)`
  width: 52px;
  height: 52px;
`;

const ResultName = styled(Texts18h27)``;
