import styled from '@emotion/styled';
import { fetcher } from '@/api';
import { ImageCentered, RoundedImageWrapper, Title } from '@/styles/commonStyle';
import ReadOnlyRating from '@/components/ReadOnlyRating';

import useSWR from 'swr';
import { dateAgo } from '@/utils/date';
import type { Review } from '@/types/review.type';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import Text from '@/components/styled/Text';
import Box from '@/components/styled/Box';
import Flex from '@/components/styled/Flex';

interface ReviewsProps {
  nickname?: string;
}

export default function PetsitterReviews({ nickname }: ReviewsProps) {
  const { data } = useSWR(`/reviews/petsitter/${nickname}?page=1&pageSize=6`, fetcher);

  return (
    <Box as="section" w="100%">
      <Flex direction="column">
        <Flex alignItems="center" gap="sm">
          <Title>후기</Title>
          <span>{data?.pagination.total} 개</span>
        </Flex>

        <Swiper slidesPerView={1.2} spaceBetween={8} css={{ width: '100%' }}>
          {data &&
            data.results.map((review: Review) => (
              <SwiperSlide key={review.id}>
                <Box as="li" p="lg" br="md" bgColor="background.box.default.primary">
                  <Flex justifyContent="space-between">
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

                    <div
                      style={{
                        width: '80px',
                        height: '80px',
                        overflow: 'hidden',
                        position: 'relative',
                      }}
                    >
                      <ImageCentered src={review.photos?.[0]} alt="review_photos" />
                    </div>
                  </Flex>
                </Box>
              </SwiperSlide>
            ))}
        </Swiper>
      </Flex>
    </Box>
  );
}

const UserImage = styled(RoundedImageWrapper)`
  width: 40px;
  height: 40px;
`;
