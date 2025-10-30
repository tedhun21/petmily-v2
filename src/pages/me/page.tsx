import styled from 'styled-components';

import { Link } from 'react-router-dom';
import { useAuthSWR } from 'hooks/authSWR';

import { fetcher } from 'api';
import MyPetmily from '@pages/me/components/MyPetmily';
import { ImageCentered, RoundedImageWrapper, Texts14h20 } from 'styles/commonStyle';
import MyPetsitterProfile from './components/MyPetsitterProfile';
import BackHeader from '@components/headers/BackHeader';
import { UserRole } from 'types/user.type';

export default function MyPage() {
  const { data: me } = useAuthSWR('/users/me', fetcher);

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
                <Texts14h20>닉네임을 설정해주세요</Texts14h20>
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
  justify-content: space-between;
  align-items: center;
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
  border: 2px solid ${({ theme }) => theme.colors.line.box.highlight};
`;

const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;

const NameText = styled.div`
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  ${({ theme }) => theme.typeScale.lg};
`;

const HelloText = styled.div`
  display: flex;
  justify-content: space-between;
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  ${({ theme }) => theme.typeScale.base};
`;

const EditLink = styled(Link)`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px;
  background-color: ${({ theme }) => theme.colors.background.box.blue.primary};
  border-radius: ${({ theme }) => theme.radius.base};
  color: white;

  &:hover {
    background-color: ${({ theme }) => theme.colors.background.box.blue.hover};
  }

  &:active {
    background-color: ${({ theme }) => theme.colors.background.box.blue.active};
    box-shadow: ${({ theme }) => theme.shadow.inset};
  }

  > span {
    color: inherit;
  }
`;
