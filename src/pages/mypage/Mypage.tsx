import styled from 'styled-components';

import { Link } from 'react-router-dom';

import MySchedule from '@components/MySchedule';
import MyPetmily from '@components/MyPetmily';
import { useCustomQuery } from 'hooks/useCustomQuery';
import { getMe } from './api';

const BUCKET_URL = process.env.REACT_APP_BUCKET_URL;

export default function Mypage() {
  const { data: me } = useCustomQuery({ queryFn: getMe });

  return (
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
        <StyledLink to="/mypage/edit">회원정보 수정</StyledLink>
      </MyProfileContianer>

      {me?.isPetsitter ? <MySchedule /> : <MyPetmily />}
    </MypageContainer>
  );
}

// 전체 페이지
const MypageContainer = styled.main`
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

const StyledLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px 8px;
  border-radius: 8px;
  color: white;
  background-color: ${(props) => props.theme.colors.mainBlue};

  &:visited {
    color: white;
  }
`;
