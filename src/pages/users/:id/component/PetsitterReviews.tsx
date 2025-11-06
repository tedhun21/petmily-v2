import styled from 'styled-components';
import { fetcher } from 'api';
import { Column, ImageCentered, RoundedImageWrapper, Row, Title } from 'styles/commonStyle';
import ReadOnlyRating from '@components/ReadOnlyRating';

import useSWR from 'swr';
import { dateAgo } from 'utils/date';
import { Review } from 'types/review.type';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Text } from 'styles/common/Text';

interface ReviewsProps {
  nickname?: string;
}

export default function PetsitterReviews({ nickname }: ReviewsProps) {
  const { data } = useSWR(`/reviews/petsitter/${nickname}?page=1&pageSize=6`, fetcher);

  return (
    <Section as="section">
      <ReviewTitle>
        <Title>후기</Title>
        <span>{data?.pagination.total} 개</span>
      </ReviewTitle>

      <StyledSwiper slidesPerView={1.2}>
        {data &&
          data.results.map((review: Review) => (
            <SwiperSlide key={review.id}>
              <ReviewCard as="li">
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
                    <Text $size="xs">{dateAgo(review.createdAt)}</Text>
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

const Section = styled(Column)`
  width: 100%;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const ReviewTitle = styled(Row)`
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const StyledSwiper = styled(Swiper)`
  width: 100%;
`;

const ReviewCard = styled(Row)`
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.radius.md};
`;

const UserWrapper = styled(Row)`
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const UserImage = styled(RoundedImageWrapper)`
  width: 40px;
  height: 40px;
`;

const StarWrapper = styled(Row)`
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;
