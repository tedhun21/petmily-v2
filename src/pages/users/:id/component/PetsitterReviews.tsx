import styled from 'styled-components';
import { fetcher } from 'api';
import { ImageCentered, RoundedImageWrapper, Title } from 'styles/commonStyle';
import ReadOnlyRating from '@components/ReadOnlyRating';

import useSWR from 'swr';
import { dateAgo } from 'utils/date';
import { Review } from 'types/review.type';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Text } from '@components/Text';
import Box from '@components/Box';
import { flex, Flex } from '@components/Flex';

interface ReviewsProps {
  nickname?: string;
}

export default function PetsitterReviews({ nickname }: ReviewsProps) {
  const { data } = useSWR(`/reviews/petsitter/${nickname}?page=1&pageSize=6`, fetcher);

  return (
    <Container as="section">
      <Flex alignItems="center" gap="sm">
        <Title>후기</Title>
        <span>{data?.pagination.total} 개</span>
      </Flex>

      <StyledSwiper slidesPerView={1.2}>
        {data &&
          data.results.map((review: Review) => (
            <SwiperSlide key={review.id}>
              <Wrapper as="li">
                <div>
                  <Flex alignItems="center" gap="sm">
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
                  </Flex>
                  <Flex alignItems="center" gap="xs">
                    <ReadOnlyRating size="12px" value={review.star} />
                    <span>·</span>
                    <Text size="xs">{dateAgo(review.createdAt)}</Text>
                  </Flex>
                  <p>{review.body}</p>
                </div>

                <div style={{ width: '80px', height: '80px', overflow: 'hidden', position: 'relative' }}>
                  <ImageCentered src={review.photos?.[0]} alt="review_photos" />
                </div>
              </Wrapper>
            </SwiperSlide>
          ))}
      </StyledSwiper>
    </Container>
  );
}

const Container = styled(Box).attrs(() => ({
  w: '100%',
}))`
  ${flex({
    direction: 'column',
  })}
`;

const StyledSwiper = styled(Swiper)`
  width: 100%;
`;

const Wrapper = styled(Box).attrs(() => ({
  p: 'lg',
  br: 'md',
  bg: 'background.secondary',
}))`
  ${flex({
    justifyContent: 'space-between',
  })}
`;

const UserImage = styled(RoundedImageWrapper)`
  width: 40px;
  height: 40px;
`;
