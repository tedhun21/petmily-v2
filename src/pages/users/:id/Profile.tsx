import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { IUser } from 'store/userSlice';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';

import Reviews from '@components/Reviews';
import PossibleReservationTime from '@components/PossibleReservationTime';
import dayjs from 'dayjs';

import useSWR from 'swr';
import { fetcherWithCookie } from 'api';
import { UserRole } from 'types/user.type';
import { PiCatBold, PiDogBold, PiStarFill } from 'react-icons/pi';
import { formatKrDays, timeRange } from 'utils/date';
import { MdOutlineRateReview } from 'react-icons/md';
import { ImageCentered, RoundedImageWrapper, Texts16h24, Texts18h27 } from 'commonStyle';
import { Link } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL;

const NavItem = [
  {
    text: '가능한 예약 시간',
    link: '/possibleReservationTime',
  },
  {
    text: '이용 후기',
    link: '/reviews',
  },
];

const careerone = () => (
  <>
    <span>대표 경력&nbsp;&nbsp;&nbsp;&nbsp;</span>
    방문훈련 전문, 동물병원근무
  </>
);

const careertwo = () => (
  <>
    &nbsp;&nbsp;<span>전문 분야&nbsp;&nbsp;&nbsp;&nbsp;</span>
    공격성 교육 전문, 대형견 전문
  </>
);

const convertTo12Hour = (time: string) => {
  // 24시간 -> 12시간으로 변환
  const timeParts = time.split(':');
  let hours = parseInt(timeParts[0]);
  const minutes = parseInt(timeParts[1]);

  const period = hours >= 12 ? 'PM' : 'AM';

  if (hours > 12) {
    hours -= 12;
  } else if (hours === 0) {
    hours = 12;
  }

  return `${hours}:${minutes < 10 ? '0' + minutes : minutes} ${period}`;
};

export default function Profile() {
  const navigate = useNavigate();
  const { nickname } = useParams();

  // 유저 정보 가져오기
  const { data: userData } = useSWR(`${API_URL}/users?q=${nickname}`, fetcherWithCookie);

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [activeTab, setActiveTab] = useState(NavItem[0].link);
  const [selectedDates, setSelectedDates] = useState<dayjs.Dayjs | null>(null);
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);

  const handleResetReservationClick = () => {
    setSelectedDates(null);
    setSelectedTimes([]);
  };

  return (
    <MainContainer>
      {/* 프로필 상단: 기본 정보 */}
      <Section>
        {/* 1. 프로필 사진 */}

        <UserImage>
          <ImageCentered src={userData?.photo ?? '/imgs/DefaultUserProfile.jpg'} alt="user_photo" />
        </UserImage>

        {/* 2. 이름과 닉네임 */}
        <div>
          <Texts18h27>{userData?.nickname}</Texts18h27>
        </div>

        {/* 3. 평점 및 리뷰 수 */}
        <div>
          <Wrapper>
            <PiStarFill size="20px" color="#279EFF" />
            <span>{userData?.star}</span>
          </Wrapper>
          <Wrapper>
            <MdOutlineRateReview size="16px" />
            <span>{userData?.reviewCount}</span>
          </Wrapper>
        </div>
      </Section>

      {/* 4. 간단한 소개 */}

      {/* 펫시터 */}
      {userData?.role === UserRole.PETSITTER && (
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
                {userData.possibleDays.map((day: any, index: number) => (
                  <DayItem key={index}>{formatKrDays(day)}</DayItem>
                ))}
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
      )}
    </MainContainer>
  );
}

const MainContainer = styled.main`
  display: flex;
  flex-direction: column;
`;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const UserImage = styled(RoundedImageWrapper)`
  width: 80px;
  height: 80px;
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
`;

const CardList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  padding: 20px;
  gap: 4px;
`;

const CardItem = styled.li`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px;
  border-radius: 16px;
  border: 2px solid ${(props) => props.theme.colors.mainBlue};
`;

const PetList = styled.ul`
  display: flex;
  gap: 8px;
`;

const PetItem = styled.li`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.theme.colors.mainBlue};
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
  background-color: ${(props) => props.theme.colors.mainBlue};
  border-radius: 12px;
  padding: 8px;
`;

const PetsitterTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 3;
  margin-top: 144px;
`;

const LogoImg = styled.img`
  width: 100%;
  height: 21px;
`;

const CareablePet = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: space-between;
  gap: 4px;
`;

const PetsitterName = styled.div`
  color: ${(props) => props.theme.colors.white};
  font-size: 28px;
  font-weight: ${(props) => props.theme.fontWeights.extrabold};
`;

const Introbox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PetsitterIntroText = styled.div`
  display: -webkit-box;
  -webkit-line-clamp: 4; // 3줄로 보여주는 것으로 제한
  -webkit-box-orient: vertical;
  overflow: hidden;
  overflow-y: auto;
  max-width: 70%;
  max-height: 200px;
  margin-top: 40px;
  color: ${(props) => props.theme.textColors.gray50};
  font-size: ${(props) => props.theme.fontSize.s14h21};
  font-weight: ${(props) => props.theme.fontWeights.normal};

  /* Hide scrollbar for Chrome, Safari and Opera */
  ::-webkit-scrollbar {
    display: none;
  }
  /* Hide scrollbar for Firefox */
  scrollbar-width: none;
`;

const CareerContainer = styled.div`
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  text-align: center;
`;

const CareerText = styled.div`
  font-size: ${(props) => props.theme.fontSize.s14h21};

  span {
    font-size: ${(props) => props.theme.fontSize.s18h27};
    font-weight: ${(props) => props.theme.fontWeights.extrabold};
    color: ${(props) => props.theme.colors.mainBlue};
  }
`;

const BookmarkContainer = styled.div`
  margin-top: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 14px 12px 0 12px;
  padding: 8px 16px;
  background-color: ${(props) => props.theme.colors.white};
  box-shadow: ${(props) => props.theme.shadow.dp01};
  border-radius: 8px;
  color: ${(props) => props.theme.textColors.gray00};
  font-size: ${(props) => props.theme.fontSize.s18h27};
  font-weight: ${(props) => props.theme.fontWeights.extrabold};
`;

const RatingImg = styled.img`
  width: 18px;
  height: 18px;
  margin: 0 32px 0 0;
`;

const MiddleLineImg = styled.img`
  margin: 0 18px 0 34px;
`;

const BookmarkIcon = styled.img`
  width: 18px;
  height: 18px;
  margin: 0 18px 0 8px;
`;

const StyledButton = styled(Button)`
  display: flex;
  justify-content: space-around;
  gap: 12px;
`;

const ViewDetailsContainer = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  background-color: ${(props) => props.theme.colors.white};
  margin: 16px 12px 12px 12px;
  padding-top: 16px;
  /* min-height: 320px; */
  box-shadow: ${(props) => props.theme.shadow.dp01};
  overflow: visible;
`;

const NavBarButton = styled.button<{ isActive: boolean }>`
  width: 100%;
  flex: 1;
  border: none;
  background-color: white;
  font-weight: ${(props) => (props.isActive ? props.theme.fontWeights.extrabold : props.theme.fontWeights.bold)};
  color: ${(props) => (props.isActive ? 'black' : props.theme.textColors.gray30)};
  border-bottom: ${(props) => (props.isActive ? `2px solid ${props.theme.colors.mainBlue}` : null)};
  padding-bottom: 36px;
  margin-bottom: ${(props) => (props.isActive ? '-2px' : '0px')};
  ${(props) => props.theme.fontSize.s14h21};
  height: 16%;
`;

const TabButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const TabContentContainer = styled.div`
  display: flex;
  padding: 0 12px 12px 12px;
`;

const ConfirmationSection = styled.div`
  padding: 16px;
  justify-content: center;
  align-items: center;
  text-align: center;
  gap: 20px;
  border-radius: 0 0 8px 8px;
`;

const ConfirmationDate = styled.div`
  margin-top: 12px;
  margin-bottom: 8px;
`;

const ConfirmationTime = styled.div`
  margin-bottom: 8px;
`;

const StyledCancelButton = styled(Button)``;

const ButtonContainer = styled.div`
  margin: 0 24px 20px 24px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledSubmitButton = styled.button`
  border-radius: 8px;
  width: 100%;
  padding: 12px;
  border: none;
  background-color: ${({ theme }) => theme.colors.mainBlue};
  color: white;
  ${({ theme }) => theme.fontSize.s16h24};

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:hover {
    background-color: ${({ theme }) => theme.colors.subBlue};
  }
  &:active {
    background-color: ${({ theme }) => theme.colors.darkBlue};
    box-shadow: ${({ theme }) => theme.shadow.inset};
  }
`;

const DefaultImg = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: ${(props) => props.theme.textColors.primary};
`;
