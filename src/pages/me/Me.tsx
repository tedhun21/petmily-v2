import styled from 'styled-components';

import { Link } from 'react-router-dom';
import useSWR from 'swr';

import { FaArrowLeft } from 'react-icons/fa6';

import { getMe } from '@pages/common/api';
import MyPetmily from '@pages/me/components/MyPetmily';
import MySchedule from '@components/MySchedule';

const API_URL = process.env.REACT_APP_API_URL;
const BUCKET_URL = process.env.REACT_APP_BUCKET_URL;

export default function Me() {
  const { data: me } = useSWR(`${API_URL}/users/me`, getMe);

  return (
    <>
      <StyledLink to="/">
        <FaArrowLeft color="#279EFF" size="24px" />
      </StyledLink>
      <MypageContainer>
        <MyProfileContianer>
          <MyProfile>
            {me?.photo ? (
              <MyPhoto src={`${BUCKET_URL}${me.photo.url}`} alt="user profile image" />
            ) : (
              <MyPhoto src="imgs/DefaultUser.svg" alt="default profile image" />
            )}
            <TextField>
              <NameText>{`${me?.nickname} 님`}</NameText>
              <HelloText>안녕하세요!</HelloText>
            </TextField>
          </MyProfile>
          <EditLink to="/me/edit">
            <span>회원정보 수정</span>
          </EditLink>
        </MyProfileContianer>

        {me?.isPetsitter ? <MySchedule /> : <MyPetmily />}
      </MypageContainer>
    </>
  );
}

const StyledLink = styled(Link)`
  padding: 20px;
`;

// 전체 페이지
const MypageContainer = styled.main`
  display: flex;
  flex-direction: column;
  gap: 40px;
  width: 100%;
  height: 100%;
  padding: 36px;
  background-color: white;
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
`;

const MyPhoto = styled.img`
  width: 60px;
  height: 60px;
  margin-right: 20px;
  border-radius: 50%;
`;

const TextField = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;

const NameText = styled.div`
  ${(props) => props.theme.fontSize.s18h27};
  font-weight: 600;
`;

const HelloText = styled.div`
  ${(props) => props.theme.fontSize.s16h24};
  font-weight: 600;
  display: flex;
  justify-content: space-between;
`;

const EditLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: 8px;
  color: white;
  background-color: ${(props) => props.theme.colors.mainBlue};

  &:hover {
    background-color: ${(props) => props.theme.colors.subBlue};
  }

  &:active {
    background-color: ${(props) => props.theme.colors.darkBlue};
    box-shadow: ${(props) => props.theme.shadow.inset};
  }

  > span {
    color: inherit;
  }
`;
