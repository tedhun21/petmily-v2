import { useEffect, useRef, useState } from 'react';

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

interface ReviewPhotoCardProps {
  review: Review;
}

export default function PhotoReviewCard({ review }: ReviewPhotoCardProps) {
  const [isTextOverflow, setIsTextOverflow] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

  const {
    reservation: { client, petsitter },
  } = review;

  const handleRestOpen = () => {
    setIsExpanded(true);
  };

  useEffect(() => {
    if (textRef.current) {
      const element = textRef.current;

      const lineHeight = parseFloat(getComputedStyle(element).lineHeight);
      const maxHeight = lineHeight * 3;
      if (element.scrollHeight > maxHeight) {
        setIsTextOverflow(true);
      }
    }
  }, [review.body]);

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
                <ReviewImageContainer>
                  <ImageCentered src={`${photo}`} alt={`review_photo_${index}`} />
                </ReviewImageContainer>
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
            <ReviewText ref={textRef} $isExpanded={isExpanded}>
              {review?.body}
            </ReviewText>
            {isTextOverflow && !isExpanded && (
              <RestButton type="button" onClick={handleRestOpen}>
                더보기
              </RestButton>
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

const ReviewImageContainer = styled.div`
  position: relative;
  overflow: hidden;
  width: 100%;
  aspect-ratio: 1/1;
  object-fit: cover;
`;

const ReviewText = styled.p<{ $isExpanded: boolean }>`
  display: box;
  -webkit-line-clamp: ${({ $isExpanded }) => ($isExpanded ? 'none' : '3')};
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.5;
  word-wrap: break-word;
`;

const RestButton = styled.button`
  ${({ theme }) => theme.typeScale.xs};
`;

// TODO: border
const PetsitterContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.space.md};
  border: 2px solid ${({ theme }) => theme.colors.line.box.highlight};
  border-radius: ${({ theme }) => theme.radius.md};
  gap: ${({ theme }) => theme.space.sm};
`;

const PetsitterImage = styled(RoundedImageWrapper)`
  width: 40px;
  height: 40px;
  border: 2px solid ${({ theme }) => theme.colors.line.box.highlight};
`;
