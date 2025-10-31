import { useParams } from 'react-router-dom';

import styled from 'styled-components';

import { useAuthSWR } from 'hooks/authSWR';
import { fetcher } from 'api';
import { BlueLink, BottomFixed, Divider, Float } from 'styles/commonStyle';

import BackHeader from '@components/headers/BackHeader';
import UserBasicInfo from './component/UserBasicInfo';
import PetsitterCapabilities from './component/PetsitterCapabilities';
import PawAndMessage from './component/PawAndMessage';
import PetsitterReviews from './component/PetsitterReviews';
import { UserRole } from 'types/user.type';

export default function ProfilePage() {
  const { nickname } = useParams();

  // 유저 정보 가져오기
  const { data: userData } = useAuthSWR(`/users?q=${nickname}`, fetcher);
  console.log('🚀 ~ ProfilePage ~ userData:', userData);

  return (
    <div>
      {/* 예약하러가기 */}
      <BackHeader title={nickname} />

      <Main>
        {/* 유저의 기본정보 */}
        <UserBasicInfo
          role={userData?.role}
          nickname={userData?.nickname}
          photo={userData?.photo}
          body={userData?.body}
          star={userData?.star}
          reviewCount={userData?.reviewCount}
        />

        <PawAndMessage userId={userData?.id} />

        <Divider />

        {/* 펫시터의 가능 */}
        <PetsitterCapabilities
          possiblePetSpecies={userData?.possiblePetSpecies}
          possibleDays={userData?.possibleDays}
          possibleStartTime={userData?.possibleStartTime}
          possibleEndTime={userData?.possibleEndTime}
          possibleLocations={userData?.possibleLocations}
        />

        <Divider />

        <PetsitterReviews nickname={userData?.nickname} />

        {/* {showDate && <PossibleDate petsitter={userData} />} */}
      </Main>
      {userData?.role === UserRole.PETSITTER && (
        <BottomFixed>
          <FloatingContainer>
            <CustomLink to={`/book?petsitter=${userData?.id}`}>예약하러가기</CustomLink>
          </FloatingContainer>
        </BottomFixed>
      )}
    </div>
  );
}

const Main = styled.main`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => theme.spacing.xl};
`;

const CustomLink = styled(BlueLink)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: ${({ theme }) => theme.spacing.xl};
  background-color: ${({ theme }) => theme.colors.background.box.blue.primary};
  color: ${({ theme }) => theme.colors.text.white};

  &:hover {
    background-color: ${({ theme }) => theme.colors.background.box.blue.hover};
  }

  &:active {
    background-color: ${({ theme }) => theme.colors.background.box.blue.active};
    box-shadow: ${({ theme }) => theme.shadow.inset};
  }
`;

const FloatingContainer = styled(Float)`
  bottom: 0;
  width: 100%;
  padding: ${({ theme }) => theme.spacing.xl};
`;
