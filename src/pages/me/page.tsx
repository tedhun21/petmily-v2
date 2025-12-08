import styled from '@emotion/styled';

import { useAuthSWR } from '@/hooks/authSWR';

import { fetcher } from '@/api';
import MyPetmily from '@/pages/me/components/MyPetmily';
import { ImageCentered, RoundedImageWrapper } from '@/styles/commonStyle';
import MyPetsitterProfile from './components/MyPetsitterProfile';
import BackHeader from '@/components/headers/BackHeader';
import { UserRole } from '@/types/user.type';
import { Text } from '@/components/styled/Text';
import Box from '@/components/styled/Box';
import Flex from '@/components/styled/Flex';
import Link from '@/components/styled/Link';

export default function MyPage() {
  const { data: me } = useAuthSWR('/users/me', fetcher);

  return (
    <>
      <BackHeader link="/" />
      <main>
        <Box p="md">
          <Flex justifyContent="space-between" alignItems="center">
            <Flex gap="lg">
              <MyImage>
                <ImageCentered
                  src={me?.photo ? `${me?.photo}` : 'imgs/DefaultUserProfile.jpg'}
                  alt="user profile image"
                />
              </MyImage>

              <Flex direction="column">
                <Text size="base" weight="bold">
                  안녕하세요!
                </Text>
                {me?.nickname ? (
                  <Text size="base" weight="bold">{`${me?.nickname} 님`}</Text>
                ) : (
                  <Text size="sm">닉네임을 설정해주세요</Text>
                )}
              </Flex>
            </Flex>
            <Link to="/me/edit" type="text">
              내 정보 수정
            </Link>
          </Flex>
        </Box>

        {me?.role === UserRole.CLIENT ? (
          <MyPetmily />
        ) : me?.role === UserRole.PETSITTER ? (
          <MyPetsitterProfile me={me} />
        ) : null}
      </main>
    </>
  );
}

const MyImage = styled(RoundedImageWrapper)`
  width: 60px;
  height: 60px;
  border: 2px solid ${({ theme }) => theme.colors.line.box.highlight};
`;
