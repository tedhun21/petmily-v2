import styled from 'styled-components';

import { useParams, Link } from 'react-router-dom';

import dayjs from 'dayjs';

import Reviews from './component/Reviews';
import { useAuthSWR, useAuthSWRMutation } from 'hooks/authSWR';
import { fetcher, updater } from 'api';
import { UserRole } from 'types/user.type';
import { PiCatBold, PiDogBold } from 'react-icons/pi';
import { timeRange, weekdays } from 'utils/date';
import { MdOutlineRateReview } from 'react-icons/md';
import { Column, Divider, ImageCentered, RoundedImageWrapper, Row, Texts18h27, Title } from 'styles/commonStyle';

import ReadOnlyRating from '@components/ReadOnlyRating';

import PossibleDate from './component/PossibleDate';
import { FormProvider, useForm } from 'react-hook-form';
import BackHeader from '@components/headers/BackHeader';
import { FaHeart, FaRegHeart } from 'react-icons/fa6';

interface IDateForm {
  date: string | null;
  startTime: string | null;
  endTime: string | null;
}

export default function ProfilePage() {
  const { nickname } = useParams();
  const methods = useForm<IDateForm>({
    defaultValues: {
      date: null,
      startTime: null,
      endTime: null,
    },
  });
  const { date, startTime, endTime } = methods.watch();

  // 나의 찜
  const { data: favorites, mutate } = useAuthSWR('/users/me/favorites', fetcher);

  const { trigger } = useAuthSWRMutation('/users/me/favorites', updater);

  // 유저 정보 가져오기
  const { data: userData } = useAuthSWR(`/users?q=${nickname}`, fetcher);

  // userData가 없을 경우 초기값을 false로 설정
  const isFavorite = userData && favorites ? favorites.some((favorite: any) => favorite.id === userData.id) : false;

  const handleFavoriteClick = async () => {
    const formData = {
      action: isFavorite ? 'unfavorite' : 'favorite',
      opponentId: userData.id,
    };

    const optimisticFavorite = isFavorite
      ? favorites.filter((fav: any) => fav.id !== userData.id)
      : [...favorites, { id: userData.id, nickname: userData.nickname, photo: userData.photo }];

    try {
      // 실제 API 요청 실행
      await trigger(formData, { revalidate: false });

      //  optimistic update 적용
      mutate(optimisticFavorite, { rollbackOnError: true, revalidate: false });
    } catch (e) {
      console.error(e);
      mutate(favorites, { rollbackOnError: true, revalidate: false });
    }
  };

  return (
    <FormProvider {...methods}>
      <Main>
        <BackHeader title={nickname} />
        {/* 프로필 상단: 기본 정보 */}
        <Container>
          <Section>
            {/* 1. 프로필 사진 */}
            <UserContainer>
              <UserImage>
                <ImageCentered src={userData?.photo ?? '/imgs/DefaultUserProfile.jpg'} alt="user_photo" />
              </UserImage>

              {/* 2. 이름과 닉네임 */}
              <Texts18h27>
                {userData?.role === UserRole.PETSITTER
                  ? `펫시터: ${userData?.nickname} 님`
                  : `${userData?.nickname} 님`}
              </Texts18h27>
            </UserContainer>

            {/* 3. 평점 및 리뷰 수 */}
            <StarReview>
              <Wrapper>
                <button type="button" onClick={handleFavoriteClick}>
                  {isFavorite ? <FaHeart size="24px" color="red" /> : <FaRegHeart size="24px" color="red" />}
                </button>
              </Wrapper>

              <Divider $orientation="vertical" />

              <Wrapper>
                <span>{userData?.star}</span>
                <ReadOnlyRating size="20px" value={userData?.star || 0} />
              </Wrapper>

              <Divider $orientation="vertical" />

              <Wrapper>
                <span>{userData?.reviewCount} 개</span>
                <MdOutlineRateReview size="16px" />
              </Wrapper>
            </StarReview>

            <CardList>
              {/* 펫시터 가능 펫 종류 */}
              {userData?.possiblePetSpecies && (
                <CardItem>
                  <span>가능 펫 종류</span>
                  <PetList>
                    {userData.possiblePetSpecies.map((species: any, index: number) => (
                      <PetItem key={index}>
                        {species === 'Dog' ? (
                          <PiDogBold size="20px" color="white" />
                        ) : species === 'Cat' ? (
                          <PiCatBold size="20px" color="white" />
                        ) : null}
                      </PetItem>
                    ))}
                  </PetList>
                </CardItem>
              )}

              {/* 펫시터 가능 요일 */}
              {userData?.possibleDays && (
                <CardItem>
                  <span>가능 요일</span>
                  <DayList>
                    {userData.possibleDays.map((day: any, index: number) => {
                      const matchedDay = weekdays.find((weekday) => weekday.value === day);
                      return <DayItem key={index}>{matchedDay?.label}</DayItem>;
                    })}
                  </DayList>
                </CardItem>
              )}

              {/* 펫시터 가능 시간 */}
              {userData?.possibleStartTime && userData?.possibleEndTime && (
                <CardItem>
                  <span>가능 시간</span>
                  <span>{timeRange(userData.possibleStartTime, userData.possibleEndTime)}</span>
                </CardItem>
              )}

              {/* 펫시터 가능 요일, 시간 */}

              {/* 예약하러가기 버튼 */}
            </CardList>
          </Section>

          <Divider />

          {/* 4. 간단한 소개 */}
          <Section>
            <Title>소개</Title>
            <p>{userData?.body}</p>
            <p>안녕하세요 몇년차 경력 펫시터 펫시터입니다 잘 합니다!</p>
          </Section>

          <Divider />

          <Reviews nickname={nickname} />

          <Divider />

          <PossibleDate petsitter={userData} />
        </Container>

        <ButtonContainer>
          <StyledLink
            to={`book?date=${dayjs(date).format('YYYY-MM-DD')}&checkIn=${startTime}&checkOut=${endTime}`}
            disabled={!date || !startTime || !endTime}
          >
            <span>예약하기</span>
          </StyledLink>
        </ButtonContainer>
      </Main>
    </FormProvider>
  );
}

const Main = styled.main`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const Container = styled(Column)`
  flex: auto;
  height: 100%;
  gap: 20px;
  padding: 20px;
  overflow-y: auto;
`;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const UserContainer = styled(Column)`
  align-items: center;
  gap: 16px;
`;

const UserImage = styled(RoundedImageWrapper)`
  width: 80px;
  height: 80px;
`;

const StarReview = styled(Row)`
  border: 1px solid ${({ theme }) => theme.line.box.primary};
  border-radius: 12px;
  padding: 20px;
  width: 100%;
`;

const Wrapper = styled(Column)`
  flex: 1;
  justify-content: center;
  align-items: center;
  gap: 8px;
`;

const CardList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  width: 100%;
`;

const CardItem = styled.li`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 8px;
  padding: 8px;
  border-radius: 12px;
  border: 2px solid ${({ theme }) => theme.line.box.highlight};
`;

const PetList = styled.ul`
  display: flex;
  gap: 8px;
`;

const PetItem = styled.li`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.background.highlight};
  border-radius: 16px;
  padding: 8px;
`;

const DayList = styled.ul`
  display: flex;
  gap: 8px;
`;

const DayItem = styled.li`
  display: flex;
  justify-content: center;
  align-items: cetner;
  color: white;
  background-color: ${({ theme }) => theme.background.highlight};
  border-radius: 12px;
  padding: 8px;
`;

const ButtonContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  padding: 20px;
  background-color: ${({ theme }) => theme.background.primary};
`;

const StyledLink = styled(Link)<{ disabled: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  border-radius: ${({ theme }) => theme.radius.normal};
  width: 100%;
  color: ${({ theme }) => theme.text.white};

  // hover와 active 스타일을 disabled일 때 비활성화
  pointer-events: ${({ disabled }) => (disabled ? 'none' : 'auto')};

  background-color: ${({ theme, disabled }) =>
    disabled ? theme.background.box.blue.disabled : theme.background.box.blue.primary};

  &:hover {
    background-color: ${({ theme }) => theme.background.box.blue.hover};
  }

  &:active {
    background-color: ${({ theme }) => theme.background.box.blue.active};
    box-shadow: ${({ theme }) => theme.shadow.inset};
  }

  ${({ theme }) => theme.fontSize.s16h24};
`;
