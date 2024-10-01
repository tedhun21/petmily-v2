import { Column, ImageCentered, RoundedImageWrapper, Row, Texts12h18, Texts14h21 } from 'commonStyle';
import styled from 'styled-components';
import { PiStarFill } from 'react-icons/pi';
import { dateAgo } from 'utils/date';

export default function ReviewCard({ review }: any) {
  const {
    reservation: { client },
    body,
    star,
  } = review;

  return (
    <Card>
      <ClientContainer>
        <ClientImageName>
          <ClientImage>
            <ImageCentered src={client?.photo ? `${client?.photo}` : '/imgs/DefaultUserProfile.jpg'} alt="user_photo" />
          </ClientImage>
          <Texts14h21>{client?.nickname} 고객님</Texts14h21>
        </ClientImageName>
        <StarWrapper>
          <PiStarFill size="20px" color="#279EFF" />
          <span>{star}</span>
        </StarWrapper>
      </ClientContainer>
      <ContentContainer>
        <ReviewText>{body}</ReviewText>
        <UserTimeAgo>
          <Texts12h18>{dateAgo(review.createdAt)}</Texts12h18>
        </UserTimeAgo>
      </ContentContainer>
    </Card>
  );
}

const Card = styled(Column)`
  padding: 16px;
  gap: 12px;
  border-radius: 16px;
  background-color: ${(props) => props.theme.colors.gray};
`;

const ClientContainer = styled(Row)`
  width: 100%;
  justify-content: space-between;
  align-items: start;
`;

const ClientImageName = styled(Row)`
  align-items: center;
  gap: 4px;
`;

const ClientImage = styled(RoundedImageWrapper)`
  width: 46px;
  height: 46px;
  border: 2px solid ${(props) => props.theme.colors.mainBlue};
`;

const ContentContainer = styled(Column)`
  // flex: auto;
  gap: 24px;
`;

const StarWrapper = styled(Row)`
  align-items: center;
  gap: 4px;
`;

const UserTimeAgo = styled(Column)`
  text-align: right;
`;

const ReviewText = styled.p`
  display: -webkit-box;
  -webkit-line-clamp: 3; /* 3줄까지만 표시 */
  -webkit-box-orient: vertical;
  overflow: hidden; /* 넘치는 텍스트 숨김 */
  text-overflow: ellipsis; /* 넘칠 경우 ... 표시 */
  line-height: 1.5; /* 줄 간격 */
  word-wrap: break-word; /* 긴 단어가 있으면 줄 바꿈 */
`;
