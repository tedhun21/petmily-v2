import { Link } from 'react-router-dom';

import { Swiper, SwiperSlide } from 'swiper/react';
import styled from 'styled-components';
import { Rating } from '@mui/material';

import { dateAgo, dateFormat, timeRange } from 'utils/date';
import PetCard from '../../home/PetCard';
import { Column, ImageCentered, RoundedImageWrapper, Row, Texts12h18, Texts16h24 } from 'commonStyle';

import 'swiper/css';
import 'swiper/css/pagination';

import { Pagination } from 'swiper/modules';
import { PiStarFill } from 'react-icons/pi';
import { useEffect, useRef, useState } from 'react';

const BUCKET_URL = process.env.REACT_APP_BUCKET_URL;

export default function ReviewPhotoCard({ review }: any) {
  const [isTextOverflow, setIsTextOverflow] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);
  const {
    reservation: { startTime, endTime, pets, client, petsitter },
  } = review;
  const { year, month, day } = dateFormat(review.reservation.date);

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
        {review?.photos.map((photo: any, index: number) => (
          <SwiperSlide key={index}>
            <ReviewImageContainer>
              <ImageCentered src={`${photo}`} alt={`review_photo_${index}`} />
            </ReviewImageContainer>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* 예약 정보 */}
      {/* <ReservationContainer>
        <span>맡기신 펫</span>
        <PetContainer>
          {pets.map((pet: any) => (
            <PetCard key={pet.id} pet={pet} />
          ))}
        </PetContainer>
        <DateWrapper>
          <span>케어 날짜:</span>
          <span>{`${year}.${month}.${day}`}</span>
          <span>{timeRange(startTime, endTime)}</span>
        </DateWrapper>
      </ReservationContainer> */}

      <ReviewContainer>
        <TitleContainer>
          <ClientInfo>
            <ClientImage>
              <ImageCentered
                src={client?.photo ? `${client.photo}` : '/imgs/DefaultUserProfile.jpg'}
                alt="default_user"
              />
            </ClientImage>
            <Texts16h24>{client?.nickname} 고객님</Texts16h24>
          </ClientInfo>
          <StarWrapper>
            <PiStarFill size="20px" color="#279EFF" />
            <span>{review?.star}</span>
          </StarWrapper>
        </TitleContainer>
        <div>
          <ReviewText ref={textRef} isExpanded={isExpanded}>
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
        <PetsitterDetailLink to={``}>자세히 보기</PetsitterDetailLink>
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

const ClientInfo = styled(Row)`
  gap: 8px;
  align-items: center;
`;

const TitleContainer = styled(Row)`
  justify-content: space-between;
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

const ClientImage = styled(RoundedImageWrapper)`
  width: 50px;
  height: 50px;
  border: 2px solid ${(props) => props.theme.colors.mainBlue};
`;

const ReviewText = styled.p<{ isExpanded: boolean }>`
  display: -webkit-box;
  -webkit-line-clamp: ${(props) => (props.isExpanded ? 'none' : '3')};
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.5;
  word-wrap: break-word;
`;

const RestButton = styled.button`
  ${(props) => props.theme.fontSize.s12h18};
`;

const PetsitterContainer = styled(Row)`
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  border: 2px solid ${(props) => props.theme.colors.mainBlue};
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
  border: 2px solid ${(props) => props.theme.colors.mainBlue};
`;

const PetsitterDetailLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.mainBlue};
  ${({ theme }) => theme.fontSize.s14h21}
  padding: 4px 8px;
  border-radius: 4px;
  color: white;

  &:hover {
    background-color: ${({ theme }) => theme.colors.subBlue};
  }

  &:active {
    background-color: ${({ theme }) => theme.colors.darkBlue};
    box-shadow: ${({ theme }) => theme.shadow.inset};
  }
`;
