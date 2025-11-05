import styled from 'styled-components';

import { Link } from 'react-router-dom';
import { useAuthSWR } from 'hooks/authSWR';

import { fetcher } from 'api';
import MyPetmily from '@pages/me/components/MyPetmily';
import { Column, ImageCentered, RoundedImageWrapper, Row, Texts14h20, Texts16h24 } from 'styles/commonStyle';
import MyPetsitterProfile from './components/MyPetsitterProfile';
import BackHeader from '@components/headers/BackHeader';
import { UserRole } from 'types/user.type';
import { Button } from '@components/buttons/Button';

export default function MyPage() {
  const { data: me } = useAuthSWR('/users/me', fetcher);

  return (
    <>
      <BackHeader link="/" />
      <Main as="main">
        <MyProfileContianer>
          <MyProfile>
            <MyImage>
              <ImageCentered
                src={me?.photo ? `${me?.photo}` : 'imgs/DefaultUserProfile.jpg'}
                alt="user profile image"
              />
            </MyImage>

            <TextWrapper>
              <HelloText>안녕하세요!</HelloText>
              {me?.nickname ? (
                <NameText>{`${me?.nickname} 님`}</NameText>
              ) : (
                <Texts14h20>닉네임을 설정해주세요</Texts14h20>
              )}
            </TextWrapper>
          </MyProfile>
          <Button as={Link} to="/me/edit">
            내 정보 수정
          </Button>
        </MyProfileContianer>

        {me?.role === UserRole.CLIENT ? (
          <MyPetmily />
        ) : me?.role === UserRole.PETSITTER ? (
          <MyPetsitterProfile me={me} />
        ) : null}
      </Main>
    </>
  );
}

// 전체 페이지
const Main = styled(Column)`
  gap: ${({ theme }) => theme.spacing._4xl};
  width: 100%;
  height: 100%;
  padding: 20px;
`;

// 유저 컨테이너
const MyProfileContianer = styled(Row)`
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: auto;
`;

const MyProfile = styled(Row)`
  gap: ${({ theme }) => theme.spacing.sm};
`;

const MyImage = styled(RoundedImageWrapper)`
  width: 60px;
  height: 60px;
  border: 2px solid ${({ theme }) => theme.colors.line.box.highlight};
`;

const TextWrapper = styled(Column)`
  justify-content: space-around;
`;

const NameText = styled(Texts16h24)`
  font-weight: ${({ theme }) => theme.fontWeight.bold};
`;

const HelloText = styled(Texts16h24)`
  font-weight: ${({ theme }) => theme.fontWeight.bold};
`;
