import { useState } from 'react';

import styled from 'styled-components';

import { styled as styledMui } from '@mui/material/styles';
import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';

import { Title } from 'commonStyle';
import { getNewestReviews } from './api';

import ReviewCard from './ReviewCard';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { useCustomQuery } from 'hooks/useCustomQuery';

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
    slidesToSlide: 3, // optional, default to 1.
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
    slidesToSlide: 2, // optional, default to 1.
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
    slidesToSlide: 1, // optional, default to 1.
  },
};

export default function RealTimeReviews() {
  const [page, setPage] = useState<number>(1);
  const { data } = useCustomQuery({ queryFn: () => getNewestReviews({ page, size: 10 }) });

  return (
    <section>
      <Title>실시간 후기</Title>
      {data?.results?.length > 0 ? (
        <Carousel
          infinite={true}
          autoPlay={true}
          autoPlaySpeed={8000}
          centerMode={true}
          transitionDuration={2000}
          responsive={responsive}
        >
          {data?.results?.map((review: any) => <ReviewCard key={review.id} review={review} />)}
        </Carousel>
      ) : null}

      {/* <RealtimeReviewContainer>
        <CustomCarousel
          showThumbs={false}
          showStatus={false}
          autoPlay={true}
          emulateTouch={true}
          stopOnHover={true}
          infiniteLoop={true}
          showArrows={false}
          useKeyboardArrows={false}
        >
          {newestReviews.map((review) => (
            <ReviewCard key={review.reviewId}>
              <ImageContainer>
                {review.memberPhoto ? (
                  <MemberPhotoImage
                  // src={review.memberPhoto.replace('https:/bucketUrl', bucketUrl)}
                  // alt="client"
                  // onError={onErrorImg}
                  />
                ) : (
                  <img src="/imgs/DefaultUser.svg" alt="clientPhoto" />
                )}
              </ImageContainer>
              <RemainContainer>
                <AddressRatingContainer>
                  <AddressText>
                    {review.reservationAddress.split(' ')[1] + ' ' + review.reservationAddress.split(' ')[2]}
                  </AddressText>
                  <StyledRating value={review.star} precision={1} icon={<StarIcon />} readOnly />
                </AddressRatingContainer>
                <ReviewText>{review.body}</ReviewText>
                <div style={{ height: '24px' }}></div>
              </RemainContainer>
            </ReviewCard>
          ))}
        </CustomCarousel>
      </RealtimeReviewContainer> */}
    </section>
  );
}

const AddressRatingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const AddressText = styled.div`
  ${({ theme }) => theme.fontSize.s18h27}
  font-weight: ${({ theme }) => theme.fontWeights.bold};
`;

const StyledRating = styledMui(Rating)({
  '& .MuiRating-iconFilled': {
    color: '#279EFF',
  },
});

const ReviewText = styled.div`
  display: block;
  display: box;
  overflow: hidden;
  padding-top: 12px;
  line-height: 1.2;
  text-align: left;
  white-space: normal; /* 줄 바꿈 허용 */
  max-height: 100px;
  text-overflow: ellipsis;
  -webkit-line-clamp: 3; /* 원하는 줄 수 설정 */
  -webkit-box-orient: vertical;
  word-wrap: break-word; /* 긴 단어를 여러 줄로 줄 바꿈하기 위해 필요한 추가 속성 */
`;

const MemberPhotoImage = styled.img`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  transform: translate(-50%, -50%);
`;

const ReservationButton = styled.button`
  ${(props) => props.theme.fontSize.s14h21};
  font-weight: ${(props) => props.theme.fontWeights.light};
  background-color: ${(props) => props.theme.colors.mainBlue};
  border-radius: 4px;
  border: none;
  color: ${(props) => props.theme.colors.white};
  padding: 2px 8px;
  white-space: nowrap;
  margin-left: auto;
  margin-bottom: auto;
  cursor: pointer;
`;
