import { useParams } from 'react-router-dom';

import styled from '@emotion/styled';

import { fetcher } from '@/api';
import { Divider } from '@/styles/commonStyle';

import UserBasicInfo from './component/UserBasicInfo';
import PetsitterCapabilities from './component/PetsitterCapabilities';
import PawAndMessage from './component/PawAndMessage';
import PetsitterReviews from './component/PetsitterReviews';
import { UserRole } from '@/types/user.type';
import FixedBottom from '@/components/FixedBottom';
import Link from '@/components/styled/Link';
import useSWR from 'swr';
import Header from '@/components/headers/Header';

export default function ProfilePage() {
  const { id } = useParams();

  // 유저 정보 가져오기
  const { data: user } = useSWR(`/users/${id}`, fetcher);

  return (
    <>
      <Header center={user?.nickname} />

      <Main>
        {/* 유저의 기본정보 */}
        <UserBasicInfo
          role={user?.role}
          nickname={user?.nickname}
          photo={user?.photo}
          body={user?.body}
          totalStarSum={user?.totalStarSum}
          reviewCount={user?.reviewCount}
        />

        <PawAndMessage userId={user?.id} />

        <Divider />

        {/* 펫시터의 가능 */}
        <PetsitterCapabilities
          possiblePetSpecies={user?.possiblePetSpecies}
          possibleDays={user?.possibleDays}
          possibleStartTime={user?.possibleStartTime}
          possibleEndTime={user?.possibleEndTime}
          possibleLocations={user?.possibleLocations}
        />

        <Divider />

        <PetsitterReviews nickname={user?.nickname} />

        {/* {showDate && <PossibleDate petsitter={user} />} */}
      </Main>
      {user?.role === UserRole.PETSITTER && (
        <FixedBottom>
          <Link to={`/book?petsitter=${user?.id}`}>예약하기</Link>
        </FixedBottom>
      )}
    </>
  );
}

const Main = styled.main`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.xl};
  padding: ${({ theme }) => theme.space.xl};
`;
