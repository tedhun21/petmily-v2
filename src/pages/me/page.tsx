import styled from 'styled-components';

import { useAuthSWR } from 'hooks/authSWR';

import { fetcher } from 'api';
import MyPetmily from '@pages/me/components/MyPetmily';
import { ImageCentered, RoundedImageWrapper } from 'styles/commonStyle';
import MyPetsitterProfile from './components/MyPetsitterProfile';
import BackHeader from '@components/headers/BackHeader';
import { UserRole } from 'types/user.type';
import { Text } from '@components/Text';
import Box from '@components/Box';
import { flex, Flex } from '@components/Flex';
import Link from '@components/Link';

export default function MyPage() {
  const { data: me } = useAuthSWR('/users/me', fetcher);

  return (
    <>
      <BackHeader link="/" />
      <main>
        <Container>
          <Flex>
            <MyImage>
              <ImageCentered
                src={me?.photo ? `${me?.photo}` : 'imgs/DefaultUserProfile.jpg'}
                alt="user profile image"
              />
            </MyImage>

            <Text size="base" weight="bold">
              안녕하세요!
            </Text>
            {me?.nickname ? (
              <Text size="base" weight="bold">{`${me?.nickname} 님`}</Text>
            ) : (
              <Text size="sm">닉네임을 설정해주세요</Text>
            )}
          </Flex>
          <Link to="/me/edit" type="text">
            내 정보 수정
          </Link>
        </Container>

        {me?.role === UserRole.CLIENT ? (
          <MyPetmily />
        ) : me?.role === UserRole.PETSITTER ? (
          <MyPetsitterProfile me={me} />
        ) : null}
      </main>
    </>
  );
}

const Container = styled(Box).attrs(() => ({
  p: 'md',
}))`
  ${flex({ justifyContent: 'space-between', alignItems: 'center' })}
`;

const MyImage = styled(RoundedImageWrapper)`
  width: 60px;
  height: 60px;
  border: 2px solid ${({ theme }) => theme.colors.line.box.highlight};
`;
