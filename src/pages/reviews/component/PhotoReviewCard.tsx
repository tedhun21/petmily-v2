import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import styled from 'styled-components';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import { PiStarFill } from 'react-icons/pi';

import { dateAgo } from 'utils/date';
import { Column, ImageCentered, RoundedImageWrapper, Row, Texts12h18, Texts16h24 } from 'styles/commonStyle';
import { Review } from 'types/review.type';

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
    <ReviewCard>
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

      <ReviewContainer>
        <TitleContainer>
          <StarWrapper>
            <Texts16h24>{client?.nickname.slice(0, 2) + '*****'}</Texts16h24>
            {Array.from({ length: review?.star }).map((_, index) => (
              <PiStarFill key={index} size="28px" color="#279EFF" />
            ))}
          </StarWrapper>
        </TitleContainer>
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
        <Texts12h18>{dateAgo(review.createdAt)}</Texts12h18>
      </ReviewContainer>

      {/* 펫시터 카드 */}
      <PetsitterContainer>
        <PetsitterInfo>
          <PetsitterImage>
            <ImageCentered
              src={petsitter?.photo ? `${petsitter.photo}` : '/imgs/DefaultUserProfile.jpg'}
              alt="petsitter_photo"
            />
          </PetsitterImage>
          <span>{petsitter?.nickname} 펫시터님</span>
        </PetsitterInfo>
        <PetsitterDetailLink to={`/users/${petsitter?.nickname}`}>자세히 보기</PetsitterDetailLink>
      </PetsitterContainer>
    </ReviewCard>
  );
}

const ReviewCard = styled.article`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 16px;
`;

const ReviewContainer = styled(Column)`
  justify-content: space-between;
  width: 100%;
  gap: 4px;
`;

const TitleContainer = styled(Row)`
  align-items: center;
`;

const StarWrapper = styled(Row)`
  align-items: center;
  gap: 4px;
`;

const ReviewImageContainer = styled.div`
  overflow: hidden;
  position: relative;
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
  ${({ theme }) => theme.fontSize.s12h18};
`;

const PetsitterContainer = styled(Row)`
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  border: 2px solid ${({ theme }) => theme.line.box.highlight};
  border-radius: 16px;
  gap: 8px;
`;

const PetsitterInfo = styled(Row)`
  align-items: center;
  gap: 8px;
`;

const PetsitterImage = styled(RoundedImageWrapper)`
  width: 40px;
  height: 40px;
  border: 2px solid ${({ theme }) => theme.line.box.highlight};
`;

const PetsitterDetailLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.background.box.blue.primary};
  ${({ theme }) => theme.fontSize.s14h21}
  padding: 4px 8px;
  border-radius: ${({ theme }) => theme.radius.normal};
  color: white;

  &:hover {
    background-color: ${({ theme }) => theme.background.box.blue.hover};
  }

  &:active {
    background-color: ${({ theme }) => theme.background.box.blue.active};
    box-shadow: ${({ theme }) => theme.shadow.inset};
  }
`;
