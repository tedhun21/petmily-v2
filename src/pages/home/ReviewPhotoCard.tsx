import { Rating } from '@mui/material';

import styled from 'styled-components';
import { Carousel } from 'react-responsive-carousel';
import { Column, ImageCentered, RoundedImageWrapper, Row, Texts12h18, Texts16h24 } from 'commonStyle';
import { dateAgo, dateFormat, timeRange } from 'utils/date';
import PetCard from './PetCard';
import { Link } from 'react-router-dom';

const BUCKET_URL = process.env.REACT_APP_BUCKET_URL;

export default function ReviewPhotoCard({ review }: any) {
  const { year, month, day } = dateFormat(review.reservation.date);

  console.log(review.reservation.petsitter);
  return (
    <ReviewCard>
      <TitleContainer>
        <ClientInfo>
          <ClientImage>
            {review.reservation.client.photo ? (
              <ImageCentered src={`${BUCKET_URL}${review.reservation.client.photo.url}`} />
            ) : (
              <img src="../../public/imgs/DefaultUserProfile.jpg" alt="DefaultUser" />
            )}
          </ClientImage>
          <Texts16h24>{review.reservation.client.nickname} 고객님</Texts16h24>
        </ClientInfo>
        <Texts12h18>{dateAgo(review.createdAt)}</Texts12h18>
      </TitleContainer>

      {/* 이미지 캐러셀 */}
      <StyledCarousel showArrows={false} showStatus={false} swipeable={true} showThumbs={false}>
        {review.photos.map((photo: any) => (
          <ReviewPhotoContainer key={photo.id}>
            <ReviewPhoto src={`${BUCKET_URL}${photo.url}`} />
          </ReviewPhotoContainer>
        ))}
      </StyledCarousel>

      {/* 예약 정보 */}
      <ReservationContainer>
        <span>맡기신 펫</span>
        <PetContainer>
          {review.reservation.pets.map((pet: any) => (
            <PetCard key={pet.id} pet={pet} />
          ))}
        </PetContainer>
        <DateWrapper>
          <span>케어 날짜:</span>
          <span>{`${year}.${month}.${day}`}</span>
          <span>{timeRange(review.reservation.startTime, review.reservation.endTime)}</span>
        </DateWrapper>
      </ReservationContainer>

      <ReviewParagraph>{review.body}</ReviewParagraph>

      {/* 펫시터 카드 */}
      <PetsitterContainer>
        <span>펫시터 정보</span>
        <PetsitterWrapper>
          <PetsitterInfo>
            <PetsitterImage>
              {review.reservation.petsitter.photo ? (
                <ImageCentered src={`${BUCKET_URL}${review.reservation.petsitter.photo.url}`} />
              ) : (
                <div>hi</div>
              )}
            </PetsitterImage>
            <span>{review.reservation.petsitter.nickname} 펫시터님</span>
          </PetsitterInfo>
          <PetsitterDetailLink to={``}>자세히 보기</PetsitterDetailLink>
        </PetsitterWrapper>
      </PetsitterContainer>
    </ReviewCard>
  );
}

const ReviewCard = styled.article`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 8px;
`;

const TitleContainer = styled(Row)`
  justify-content: space-between;
  width: 100%;
  gap: 4px;
`;

const ClientInfo = styled(Row)`
  gap: 8px;
  align-items: center;
`;

const StyledCarousel = styled(Carousel)`
  width: 100%;
  height: 360px;

  .dot {
    background: #279eff !important;
  }
`;

const ReviewPhotoContainer = styled.div`
  overflow: hidden;
  position: relative;
  width: 100%;
  height: 340px;
  border-radius: 20px;
  object-fit: cover;
`;

const ReviewPhoto = styled.img`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  transform: translate(-50%, -50%);
`;

const ReservationContainer = styled(Column)`
  gap: 4px;
`;

const PetContainer = styled(Row)`
  gap: 4px;
`;

const DateWrapper = styled(Row)`
  gap: 16px;
`;

const PetsitterWrapper = styled(Row)`
  align-items: center;
  justify-content: space-between;
`;

const ClientImage = styled(RoundedImageWrapper)`
  width: 50px;
  height: 50px;
`;

const ReviewParagraph = styled.p``;

const PetsitterContainer = styled(Column)`
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

const Star = styled.div`
  display: inline-block;
`;

const StyledRating = styled(Rating)`
  & .MuiRating-iconFilled {
    color: #279eff;
  }
`;

const NickName = styled.div`
  display: inline-block;
  font-weight: 800;
  font-size: 16px;
`;

const When = styled.div`
  color: #8d8d8d;
  font-size: 14px;
`;

const First = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const CarouselContainer = styled.div`
  display: flex;

  /* justify-content: center; */
  width: 100%;
`;

const ImageWrapper = styled.div`
  overflow: hidden;
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.shadow.dp04};
`;

const BodyContainer = styled.div`
  display: flex;
  margin-top: 20px;
  line-height: 1.5;
`;

const StyledImage = styled.img`
  width: 100px;
  height: auto;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
`;
