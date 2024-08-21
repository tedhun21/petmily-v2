import { useEffect, useState } from 'react';

import { useSelector } from 'react-redux';
import styled from 'styled-components';

import { ImageContainer, Title } from './Home';
import { getFavoritePetsitter } from './api';
import { IUser } from 'store/userSlice';

const bucketUrl = process.env.REACT_APP_BUCKET_URL;
export default function OffenPetsitter() {
  const { isLogin } = useSelector((state: IUser) => state.user);

  const [favoritePetsitter, setFavoritePetsitter] = useState<any>('');
  // 내가 자주 이용하는 펫시터
  useEffect(() => {
    if (isLogin) {
      const response = getFavoritePetsitter();
      console.log(response);
    }
  }, []);

  return (
    <section>
      <Title>내가 자주 이용하는 펫시터</Title>
      <OftenPetsitterContainer>
        {favoritePetsitter ? (
          <>
            <ImageContainer>
              {favoritePetsitter.photo ? (
                <ProfileImg
                  src={favoritePetsitter.photo.replace('https://bucketUrl', bucketUrl)}
                  alt="OftenPetsitterImg"
                />
              ) : (
                <img src="/imgs/PetsitterPhoto" alt="petsitterPhoto" />
              )}
            </ImageContainer>

            <OftenPetsitterbox>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Nameox>{favoritePetsitter.name}</Nameox>
                <RatingReviewContainer>
                  <RatingContainer>
                    <RatingImg src="/imgs/Star.svg" alt="star" />
                    <div>{favoritePetsitter.star}</div>
                  </RatingContainer>
                  <ReviewContainer>
                    <ReviewImg src="/imgs/ReviewIcon.svg" alt="review" />
                    <div>{favoritePetsitter.reviewCount}</div>
                  </ReviewContainer>
                </RatingReviewContainer>
              </div>
              <DiscriptionText>{favoritePetsitter.body}</DiscriptionText>
            </OftenPetsitterbox>
          </>
        ) : (
          <NotLoginPetsitter>펫시터를 찜해보세요!</NotLoginPetsitter>
        )}
      </OftenPetsitterContainer>
    </section>
  );
}

const OftenPetsitterContainer = styled.div`
  display: flex;.
  padding: 8px 12px;
  box-shadow: ${(props) => props.theme.shadow.dp01};
  border-radius: 8px;
`;

const OftenPetsitterbox = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  margin-right: 8px;
  margin-left: 24px;
`;

const NotLoginPetsitter = styled.div`
  padding: 20px;
`;

const ProfileImg = styled.img`
  position: absolute;
  width: 100%;
  height: 100%;
`;

const Nameox = styled.div`
  ${(props) => props.theme.fontSize.s16h24};
  font-weight: ${(props) => props.theme.fontWeights.bold};
`;

const RatingReviewContainer = styled.div`
  display: flex;
  gap: 8px;
`;

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const RatingImg = styled.img`
  width: 20px;
`;

const ReviewContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
`;

const ReviewImg = styled.img`
  width: 20px;
`;

const DiscriptionText = styled.div`
  display: box;
  overflow: hidden;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  flex-wrap: wrap;
  margin-top: 4px;
  color: ${(props) => props.theme.textColors.gray40};
  ${(props) => props.theme.fontSize.s14h21};
  font-weight: ${(props) => props.theme.fontWeights.light};
`;
