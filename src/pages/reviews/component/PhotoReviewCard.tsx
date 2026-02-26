import { useRef, useState, useLayoutEffect } from 'react';

import styled from '@emotion/styled';
import { PiStarFill } from 'react-icons/pi';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

import { dateAgo } from '@/utils/date';
import { ImageCentered, RoundedImageWrapper } from '@/styles/commonStyle';
import type { Review } from '@/types/review.type';
import Text from '@/components/styled/Text';

import Flex from '@/components/styled/Flex';
import Link from '@/components/styled/Link';
import Box from '@/components/styled/Box';
import Button from '@/components/styled/Button';

interface ReviewPhotoCardProps {
  review: Review;
}

const limitLines = 3;

export default function PhotoReviewCard({ review }: ReviewPhotoCardProps) {
  const [isTextOverflow, setIsTextOverflow] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

  const {
    reservation: { client, petsitter },
  } = review;

  const handleRestOpen = () => {
    setIsExpanded((prev) => !prev);
  };

  useLayoutEffect(() => {
    if (textRef.current) {
      const { scrollHeight, clientHeight } = textRef.current;

      const hasOverflow = scrollHeight > clientHeight;
      if (isTextOverflow !== hasOverflow) {
        setIsTextOverflow(hasOverflow);
      }
    }
  }, [review.body, isTextOverflow]);

  return (
    <article>
      <Flex direction="column" gap="lg">
        {/* 이미지 캐러셀 */}
        <Swiper
          pagination={{
            dynamicBullets: true,
          }}
          modules={[Pagination]}
          style={{ width: '100%', borderRadius: '16px' }}
        >
          {review?.photos &&
            review.photos.map((photo: string, index: number) => (
              <SwiperSlide key={index}>
                <Box
                  w="100%"
                  br="lg"
                  css={{
                    position: 'relative',
                    overflow: 'hidden',
                    aspectRatio: '1/1',
                    objectFit: 'cover',
                  }}
                >
                  <ImageCentered src={`${photo}`} alt={`review_photo_${index}`} />
                </Box>
              </SwiperSlide>
            ))}
        </Swiper>

        <Flex direction="column" justifyContent="space-between" gap="xs">
          <Flex alignItems="center">
            <Flex alignItems="center" gap="xs">
              <Text size="base">{client?.nickname.slice(0, 2) + '*****'}</Text>
              {Array.from({ length: review?.star }).map((_, index) => (
                <PiStarFill key={index} size="28px" color="#279EFF" />
              ))}
            </Flex>
          </Flex>
          <div>
            <ReviewText ref={textRef} limitLines={limitLines} isExpanded={isExpanded}>
              {review?.body}
            </ReviewText>
            {isTextOverflow && (
              <Button type="button" onClick={handleRestOpen} variant="transparent" size="sm">
                {isExpanded ? '접기' : '더보기'}
              </Button>
            )}
          </div>
          <Text size="xs">{dateAgo(review.createdAt)}</Text>
        </Flex>

        {/* 펫시터 카드 */}
        <PetsitterContainer>
          <Flex alignItems="center" gap="sm">
            <PetsitterImage>
              <ImageCentered
                src={petsitter?.photo ? `${petsitter.photo}` : '/imgs/DefaultUserProfile.jpg'}
                alt="petsitter_photo"
              />
            </PetsitterImage>
            <span>{petsitter?.nickname} 펫시터님</span>
          </Flex>
          <Link to={`/users/${petsitter?.id}`} type="text">
            자세히 보기
          </Link>
        </PetsitterContainer>
      </Flex>
    </article>
  );
}

const ReviewText = styled.p<{ limitLines: number; isExpanded: boolean }>`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;

  /** 줄 수 제한 */
  -webkit-line-clamp: ${({ isExpanded }) => (isExpanded ? 'none' : 3)};

  white-space: pre-wrap;
  word-wrap: break-word;
  ${({ theme }) => theme.typeScale.base};
`;

// TODO: border
const PetsitterContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.space.md};
  border: 2px solid ${({ theme }) => theme.colors.line.box.active};
  border-radius: ${({ theme }) => theme.radius.md};
  gap: ${({ theme }) => theme.space.sm};
`;

const PetsitterImage = styled(RoundedImageWrapper)`
  width: 40px;
  height: 40px;
  border: 2px solid ${({ theme }) => theme.colors.line.box.primary};
`;
