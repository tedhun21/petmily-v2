import { useEffect, useRef, useState } from 'react';

import useSWR from 'swr';
import styled from 'styled-components';
import { useNavigate, Link } from 'react-router-dom';

import { deleteCookie } from 'utils/cookie';
import { ImageCentered, RoundedImageWrapper } from 'commonStyle';
import { fetcherWithCookie } from 'api';

const API_URL = process.env.REACT_APP_API_URL;
const BUCKET_URL = process.env.REACT_APP_BUCKET_URL;

export default function MeButton() {
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null);

  const { data: me } = useSWR(`${API_URL}/users/me`, fetcherWithCookie);

  const handleMenuOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // 이벤트 전파를 막음
    setIsModalOpen((prev) => !prev);
  };

  const handleOutsideClick = (e: MouseEvent) => {
    if (isModalOpen && modalRef.current && !modalRef.current.contains(e.target as Node)) {
      setIsModalOpen(false);
    }
  };

  // 로그아웃 클
  const handleLogout = () => {
    deleteCookie('access_token');

    alert('로그아웃 되었습니다.');
    navigate('/');
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
    <UserContainer>
      {me ? (
        <UserWrapper>
          <UserButton type="button" onClick={handleMenuOpen}>
            <UserImage>
              <ImageCentered src={me.photo ? `${me.photo}` : '/imgs/DefaultUserProfile.jpg'} alt="user_photo" />
            </UserImage>
          </UserButton>

          {isModalOpen && me && (
            <LoginNavModal ref={modalRef}>
              <MypageLink to="/me" onClick={() => setIsModalOpen(false)}>
                마이페이지
              </MypageLink>
              <LogoutButton onClick={handleLogout}>로그아웃</LogoutButton>
            </LoginNavModal>
          )}
        </UserWrapper>
      ) : (
        <LoginNavLink to="/login">로그인/회원가입</LoginNavLink>
      )}
    </UserContainer>
  );
}

const UserContainer = styled.div`
  display: flex;
  gap: 12px;
`;

const UserWrapper = styled.div`
  position: relative;
`;

const UserButton = styled.button`
  border: 2px solid ${(props) => props.theme.colors.mainBlue};
  border-radius: 50%;
  position: relative;
  cursor: pointer;
`;

const UserImage = styled(RoundedImageWrapper)`
  width: 36px;
  height: 36px;
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
