import { Column, ImageCentered, RoundedImageWrapper, Row, Texts12h18 } from 'commonStyle';
import styled from 'styled-components';
import { dateAgo } from 'utils/date';

const BUCKET_URL = process.env.REACT_APP_BUCKET_URL;
export default function ReviewCard({ review }: any) {
  console.log(review);
  return (
    <ReviewContainer>
      <Card>
        <ClientContainer>
          <ImageWrapper>
            {review.reservation.client.photo ? (
              <ImageCentered src={`${BUCKET_URL}${review.reservation.client.photo.url}`} alt="userPhoto" />
            ) : (
              <div>hi</div>
            )}
          </ImageWrapper>
          <Texts12h18>{review.reservation.client.nickname} 고객님</Texts12h18>
        </ClientContainer>
        <ContentContainer>
          <ThreeLineParagraph>{review.body}</ThreeLineParagraph>
          <UserTimeAgo>
            <Texts12h18>{dateAgo(review.createdAt)}</Texts12h18>
          </UserTimeAgo>
        </ContentContainer>
      </Card>
    </ReviewContainer>
  );
}

const ReviewContainer = styled.div`
  display: flex;
  padding: 4px;
`;

const Card = styled(Column)`
  justify-content: space-between;
  width: 100%;
  padding: 8px;
  border-radius: 8px;
  background-color: white;
  gap: 16px;
  box-shadow: ${(props) => props.theme.shadow.dp02};
`;

const ClientContainer = styled(Row)`
  justify-content: space-between;
`;
const ImageWrapper = styled(RoundedImageWrapper)`
  width: 46px;
  height: 46px;
`;

const ContentContainer = styled(Column)`
  flex: auto;
  gap: 24px;
`;

const ThreeLineParagraph = styled.p`
  display: -webkit-box; /* Flexbox 컨테이너로 처리하여 줄 수 제한을 가능하게 함 */
  -webkit-box-orient: vertical; /* 수직으로 컨텐츠가 쌓이도록 설정 */
  -webkit-line-clamp: 3; /* 3줄까지만 표시 */
  overflow: hidden; /* 넘치는 텍스트는 숨김 */
  text-overflow: ellipsis; /* 넘치는 텍스트의 시각적 표시 ("...") */
  font-size: ${(props) => props.theme.fontSize.s12h18};
`;

const UserTimeAgo = styled(Column)``;
