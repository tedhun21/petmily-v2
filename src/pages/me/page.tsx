import styled from 'styled-components';

import { Link } from 'react-router-dom';
import useSWR from 'swr';

import MyPetmily from '@pages/me/components/MyPetmily';

import { fetcherWithCookie } from 'api';
import { ImageCentered, RoundedImageWrapper, Texts14h21 } from 'styles/commonStyle';
import MyPetsitterProfile from './components/MyPetsitterProfile';
import BackHeader from '@components/headers/BackHeader';
import { UserRole } from 'types/user.type';
import { API_URL } from 'config';

export default function MyPage() {
  const { data: me } = useSWR(`${API_URL}/users/me`, fetcherWithCookie);

  return (
    <>
      <BackHeader link="/" />
      <MypageContainer>
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
                <Texts14h21>닉네임을 설정해주세요</Texts14h21>
              )}
            </TextWrapper>
          </MyProfile>
          <EditLink to="/me/edit">
            <span>회원정보 수정</span>
          </EditLink>
        </MyProfileContianer>

        {me?.role === UserRole.CLIENT ? (
          <MyPetmily />
        ) : me?.role === UserRole.PETSITTER ? (
          <MyPetsitterProfile me={me} />
        ) : null}
      </MypageContainer>
    </>
  );
}

// 전체 페이지
const MypageContainer = styled.main`
  display: flex;
  flex-direction: column;
  gap: 40px;
  width: 100%;
  height: 100%;
  padding: 36px;
`;

// 유저 컨테이너
const MyProfileContianer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: auto;
`;

const MyProfile = styled.div`
  display: flex;
  gap: 8px;
`;

const MyImage = styled(RoundedImageWrapper)`
  width: 60px;
  height: 60px;
  border: 2px solid ${({ theme }) => theme.line.box.highlight};
`;

const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;

const NameText = styled.div`
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  ${({ theme }) => theme.fontSize.s18h27};
`;

const HelloText = styled.div`
  display: flex;
  justify-content: space-between;
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  ${({ theme }) => theme.fontSize.s16h24};
`;

const EditLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: ${({ theme }) => theme.radius.normal};
  color: white;
  background-color: ${({ theme }) => theme.background.box.blue.primary};

  &:hover {
    background-color: ${({ theme }) => theme.background.box.blue.hover};
  }

  &:active {
    background-color: ${({ theme }) => theme.background.box.blue.active};
    box-shadow: ${({ theme }) => theme.shadow.inset};
  }

  > span {
    color: inherit;
  }
`;
