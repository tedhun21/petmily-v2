import styled from 'styled-components';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';

import axios from 'axios';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { IUser } from 'store/userSlice';
// import { PetmilyCard } from '../pages/mypage/components/MyPetmily';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonPinIcon from '@mui/icons-material/PersonPin';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import PetsIcon from '@mui/icons-material/Pets';
import CircularProgress from '@mui/joy/CircularProgress';
import { getCookie } from 'utils/cookie';
import { Texts18h27 } from 'commonStyle';

// 디자인 수정

const apiUrl = process.env.REACT_APP_API_URL;
const token = getCookie('access_token');

type InfoType = {
  petsitterId: number;
  possiblePetType: string;
  possibleLocation: string[];
  possibleDay: string;
  possibleTimeStart: string;
  possibleTimeEnd: string;
  star: number;
  reviewCount: number;
  monthTotalReservation: number | null;
} | null;

export default function MySchedule({ me }: any) {
  // const { memberId } = useSelector((state: IUser) => state.user);

  const [info, setInfo] = useState<InfoType>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 케어가능 펫
  const getPetTypeDisplayText = (type: string) => {
    switch (type) {
      case 'CAT':
        return '고양이';
      case 'DOG':
        return '강아지';
      case 'DOGCAT':
        return '강아지와 고양이';
      default:
        return '';
    }
  };

  // 케어 가능 요일
  const getFullDayName = (shortDay: string) => {
    switch (shortDay) {
      case '월':
        return '월요일';
      case '화':
        return '화요일';
      case '수':
        return '수요일';
      case '목':
        return '목요일';
      case '금':
        return '금요일';
      case '토':
        return '토요일';
      case '일':
        return '일요일';
      default:
        return '';
    }
  };

  // const getFullDays = (days: string) => {
  //   return [...days].map(getFullDayName).join(' , ');
  // };

  const sortDaysInOrder = (days: string) => {
    const desiredOrder = ['월', '화', '수', '목', '금'];
    const sortedDays = desiredOrder.filter((day) => days.includes(day));
    return sortedDays.join(', ');
  };

  return (
    <ScheduleContainer>
      <Texts18h27>나의 설정</Texts18h27>
      <div>
        {me?.possiblePetSpecies && (
          <div>
            <span>케어 가능 동물</span>
          </div>
        )}
        {me?.possibleLocation && (
          <div>
            <span>케어 가능 지역</span>
          </div>
        )}
        {me?.possibleDays && (
          <div>
            <span>케어 가능 요일</span>
          </div>
        )}
        {me?.possibleStartTime && me?.possibleEndTime && (
          <div>
            <span>케어 가능 시간</span>
          </div>
        )}
      </div>
      <Texts18h27>나의 스케쥴</Texts18h27>
    </ScheduleContainer>
  );
}

const ScheduleContainer = styled.section`
  display: flex;
  flex-direction: column;
`;

const InfoWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-top: 20px;
`;

const Paw = styled(PetsIcon)`
  margin: 20px;
  color: #279eff;
`;

const Time = styled(AccessTimeIcon)`
  margin: 20px;
  color: #279eff;
`;

const Location = styled(PersonPinIcon)`
  margin: 20px;
  color: #279eff;
`;

const Calendar = styled(EventAvailableIcon)`
  margin: 20px;
  color: #279eff;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
`;

const InfoText = styled.div`
  ${(props) => props.theme.fontSize.s16h24};
  color: #acacac;
  font-weight: 600;
  display: flex;
  justify-content: space-between;
`;

const UserText = styled.div`
  ${(props) => props.theme.fontSize.s16h24};
  font-weight: 600;
  display: flex;
  justify-content: space-between;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0px20px;
`;

const NoContentContaier = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const Image = styled.img`
  width: 120px;
  margin-bottom: 20px;
`;
