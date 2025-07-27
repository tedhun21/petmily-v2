import styled from 'styled-components';
import { fetcher } from 'api';
import { ImageCentered, RoundedImageWrapper, Row, Texts12h18, Title } from 'styles/commonStyle';
import ReadOnlyRating from '@components/ReadOnlyRating';

import useSWR from 'swr';
import { dateAgo } from 'utils/date';
import { Review } from 'types/review.type';

interface ReviewsProps {
  nickname?: string;
}

export default function Reviews({ nickname }: ReviewsProps) {
  const { data } = useSWR(`/reviews/petsitter/${nickname}?page=1&pageSize=6`, fetcher);

  return (
    <Section>
      <ReviewTitle>
        <Title>후기</Title>
        <span>{data?.pagination.total} 개</span>
      </ReviewTitle>
      <ReviewList>
        {data &&
          data.results.map((review: Review) => (
            <ReviewCard key={review.id}>
              <UserWrapper>
                <UserImage>
                  <ImageCentered
                    src={
                      review.reservation.client.photo ? review.reservation.client.photo : '/imgs/DefaultUserProfile.jpg'
                    }
                  />
                </UserImage>
                <span>{review.reservation.client.nickname}</span>
              </UserWrapper>
              <StarWrapper>
                <ReadOnlyRating size="12px" value={review.star} />
                <span>·</span>
                <Texts12h18>{dateAgo(review.createdAt)}</Texts12h18>
              </StarWrapper>
              <p>{review?.body}</p>
            </ReviewCard>
          ))}
      </ReviewList>
    </Section>
  );
}

const Section = styled.section`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  gap: 16px;
`;

const ReviewTitle = styled(Row)`
  align-items: center;
  gap: 8px;
`;

const ReviewList = styled.ul`
  display: grid;
  flex-direction: column;
  gap: 16px;
  grid-template-columns: repeat(2, 1fr);
`;

const ReviewCard = styled.li`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const UserWrapper = styled(Row)`
  align-items: center;
  gap: 8px;
`;

const UserImage = styled(RoundedImageWrapper)`
  width: 40px;
  height: 40px;
`;

const StarWrapper = styled(Row)`
  align-items: center;
  gap: 4px;
`;
