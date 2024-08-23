import styled from 'styled-components';
import { ImageContainer, Title } from './Home';
import { Carousel } from 'react-responsive-carousel';
import { styled as styledMui } from '@mui/material/styles';
import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';
import { useEffect, useState } from 'react';
import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_URL;

export default function RealTimeReviews() {
  const [newestReviews, setNewestReviews] = useState<any[]>([]);

  useEffect(() => {
    const getNewestReview = async () => {
      try {
        const response = await axios(`${apiUrl}/reviews?page=1&size=10`);

        setNewestReviews(response.data.reviews);
      } catch (error) {
        setNewestReviews([]);
      }
    };
    getNewestReview();
  }, []);
  return (
    <section>
      <Title>실시간 후기</Title>
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

const RemainContainer = styled.div`
  flex-grow: 1;
`;

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
  overflow: hidden;
  padding-top: 12px;
  max-height: 100px;
  line-height: 1.2;
  text-align: left;
  text-overflow: ellipsis;
  white-space: normal; /* 줄 바꿈 허용 */
  display: -webkit-box;
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

const RealtimeReviewContainer = styled.div`
  box-shadow: ${(props) => props.theme.shadow.dp01};
  border-radius: 8px;
`;

const ReviewCard = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 8px;
  padding: 8px;
`;

const CustomCarousel = styled(Carousel)`
  .carousel-slider {
    overflow: visible;
  }

  .control-dots {
    /* bottom: -8px !important; */
  }

  .dot {
    background: #279eff !important;
  }
`;
