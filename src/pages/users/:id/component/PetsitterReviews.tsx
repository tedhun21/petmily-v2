import styled from 'styled-components';
import { fetcher } from 'api';
import { ImageCentered, RoundedImageWrapper, Row, Texts12h18, Title } from 'styles/commonStyle';
import ReadOnlyRating from '@components/ReadOnlyRating';

import useSWR from 'swr';
import { dateAgo } from 'utils/date';
import { Review } from 'types/review.type';
import { Swiper, SwiperSlide } from 'swiper/react';

interface ReviewsProps {
  nickname?: string;
}

export default function PetsitterReviews({ nickname }: ReviewsProps) {
  const { data } = useSWR(`/reviews/petsitter/${nickname}?page=1&pageSize=6`, fetcher);

  return (
    <Section>
      <ReviewTitle>
        <Title>후기</Title>
        <span>{data?.pagination.total} 개</span>
      </ReviewTitle>

      <StyledSwiper slidesPerView={1.2}>
        {data &&
          data.results.map((review: Review) => (
            <SwiperSlide key={review.id}>
              <ReviewCard>
                <div>
                  <UserWrapper>
                    <UserImage>
                      <ImageCentered
                        src={
                          review.reservation.client.photo
                            ? review.reservation.client.photo
                            : '/imgs/DefaultUserProfile.jpg'
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
                  <p>{review.body}</p>
                </div>

                <div style={{ width: '80px', height: '80px', overflow: 'hidden', position: 'relative' }}>
                  <ImageCentered src={review.photos?.[0]} alt="review_photos" />
                </div>
              </ReviewCard>
            </SwiperSlide>
          ))}
      </StyledSwiper>
    </Section>
  );
}

const Section = styled.section`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 16px;
`;

const ReviewTitle = styled(Row)`
  align-items: center;
  gap: 8px;
`;

const StyledSwiper = styled(Swiper)`
  width: 100%;
`;

const ReviewCard = styled.li`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 16px;

  border-radius: ${({ theme }) => theme.radius.normal};
  background-color: ${({ theme }) => theme.background.secondary};
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
