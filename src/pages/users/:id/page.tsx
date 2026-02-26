import { useParams } from 'react-router-dom';

import { fetcher } from '@/api';
import { Divider } from '@/styles/commonStyle';

import UserBasicInfo from './component/UserBasicInfo';
import PetsitterCapabilities from './component/PetsitterCapabilities';
import PawAndMessage from './component/PawAndMessage';
import PetsitterReviews from './component/PetsitterReviews';
import { UserRole } from '@/types/user.type';
import FixedBottom from '@/components/BottomCTA';
import Link from '@/components/styled/Link';
import useSWR from 'swr';
import Header from '@/components/headers/Header';
import BackButton from '@/components/buttons/BackButton';
import Box from '@/components/styled/Box';
import Flex from '@/components/styled/Flex';

export default function ProfilePage() {
  const { id } = useParams();

  const { data: user } = useSWR(`/users/${id}`, fetcher);

  return (
    <>
      <Header left={<BackButton />} center={user?.nickname} />

      <Box as="main">
        <Flex direction="column" gap="xl">
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
        </Flex>
      </Box>
      {user?.role === UserRole.PETSITTER && (
        <FixedBottom hasSafeAreaPadding>
          <Link to={`/users/${user?.id}/book`} variant="button" btnVariant="primary" size="lg">
            예약하기
          </Link>
        </FixedBottom>
      )}
    </>
  );
}
