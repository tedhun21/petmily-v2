import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';

import NavBarButton from './components/NavBarLink';
import { IUser, loginUser } from 'store/userSlice';
import { deleteCookie, getCookie, refreshAccessToken } from 'utils/cookie';
import { Column } from 'commonStyle';
import NavBar from './components/NavBar';

export default function NavHeader() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isLogin, id, isPetsitter } = useSelector((state: IUser) => state.user);

  console.log(isLogin);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null);

  const handleUserButton = (e: any) => {
    if (!isLogin) {
      navigate('/login');
    } else if (isLogin) {
      e.stopPropagation();
      setIsModalOpen(true);
    }
  };

  // 모달 외부 클릭 시 모달을 닫는 이벤트 핸들러
  const handleOutsideClick = (e: MouseEvent) => {
    if (isModalOpen && modalRef.current && !modalRef.current.contains(e.target as Node)) {
      setIsModalOpen(false);
    }
  };

  const handleLogout = () => {
    setIsModalOpen(false);
    deleteCookie('access_token');
    deleteCookie('refresh_token');
    // dispatch(deleteUser());

    navigate('/');
    alert('로그아웃 되었습니다.');
    window.location.reload();
  };

  useEffect(() => {
    if (isModalOpen) {
      // 모달이 열려있을 때만 클릭 이벤트 리스너를 추가
      window.addEventListener('click', handleOutsideClick);
    } else {
      // 모달이 닫혔을 때는 클릭 이벤트 리스너를 제거
      window.removeEventListener('click', handleOutsideClick);
    }

    // 컴포넌트 언마운트 시 클릭 이벤트 리스너를 정리
    return () => window.removeEventListener('click', handleOutsideClick);
  }, [isModalOpen]);

  return (
    <Header>
      <HeaderContatiner>
        <TopHeader>
          <Link to="/">
            <img src="/imgs/Logo.svg" alt="logo" />
          </Link>
          <NotiUserContainer>
            <UserButton onClick={(e) => handleUserButton(e)}>
              {isLogin ? (
                <img src="/icons/User.svg" alt="user_icon" width="24" />
              ) : (
                <LoginNavLink to="/login">로그인/회원가입</LoginNavLink>
              )}
            </UserButton>
          </NotiUserContainer>
          {isModalOpen && isLogin && (
            <LoginNavModal ref={modalRef}>
              <MypageLink to="/mypage" onClick={() => setIsModalOpen(false)}>
                마이페이지
              </MypageLink>
              <LogoutButton onClick={handleLogout}>로그아웃</LogoutButton>
            </LoginNavModal>
          )}
        </TopHeader>
        <NavBar />
      </HeaderContatiner>
    </Header>
  );
}

const Header = styled.header`
  display: flex;
  justify-content: center;
  position: sticky;
  top: 0;
  left: 0;
  z-index: 100;
  width: 100%;
`;

const HeaderContatiner = styled(Column)`
  justify-content: space-between;
  width: 100%;
  height: 84px;
  gap: 12px;
  padding: 12px 12px 0;
  background-color: white;
  max-width: 600px;
  box-shadow: ${(props) => props.theme.shadow.onlyBottom};
`;

const TopHeader = styled.div`
  display: flex;
  flex: 1;
  justify-content: space-between;
`;

const NotiUserContainer = styled.nav`
  display: flex;
  gap: 12px;
`;

// const NotiButton = styled.button`
//   width: 24px;
//   height: 24px;
//   border: none;
//   background-color: white;
//   cursor: pointer;
// `;

const UserButton = styled.button`
  border: none;
  background-color: white;
  cursor: pointer;
`;

const LoginNavLink = styled(Link)`
  background-color: ${({ theme }) => theme.colors.mainBlue};
  ${({ theme }) => theme.fontSize.s14h21}
  padding: 4px 8px;
  border-radius: 4px;
  color: white;

  &:hover {
    background-color: ${({ theme }) => theme.colors.subBlue};
  }

  &:active {
    background-color: ${({ theme }) => theme.colors.darkBlue};
    box-shadow: ${({ theme }) => theme.shadow.inset};
  }
`;

const LoginNavModal = styled.nav`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 24px;
  right: 24px;
  z-index: 999;
  width: 100px;
  height: 80px;
  border-radius: 8px;
  background-color: white;
  gap: 12px;
  box-shadow: ${(props) => props.theme.shadow.dp03};
`;

const MypageLink = styled(Link)`
  color: black;
  ${({ theme }) => theme.fontSize.s14h21}
  cursor:pointer;
  padding: 4px;
  border-radius: 4px;

  &:hover {
    // background-color: ${(props) => props.theme.textColors.gray30};
  }
`;

const LogoutButton = styled.button`
  border: none;
  background-color: white;
  cursor: pointer;
  ${({ theme }) => theme.fontSize.s14h21};
`;
