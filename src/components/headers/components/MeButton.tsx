import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import styled from 'styled-components';
import { useNavigate, Link } from 'react-router-dom';

import { deleteCookie } from 'utils/cookie';
import { ImageCentered, RoundedImageWrapper } from 'styles/commonStyle';
import { toast } from 'react-toastify';

export default function MeButton({ me }: any) {
  const userContainer = document.getElementById('user-container');
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null);

  const handleMenuOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // 이벤트 전파를 막음
    setIsModalOpen((prev) => !prev);
  };

  // 로그아웃 클
  const handleLogout = () => {
    deleteCookie('access_token');
    toast.success('로그아웃 되었습니다.');
    navigate('/');
    navigate(0);
  };

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as Node;

      if (modalRef.current && !modalRef.current.contains(target)) {
        setIsModalOpen(false);
      }
    };

    window.addEventListener('click', handleOutsideClick);

    // 컴포넌트 언마운트 시 클릭 이벤트 리스너를 정리
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  return (
    <UserContainer id="user-container">
      {me ? (
        <>
          <UserButton type="button" onClick={handleMenuOpen}>
            <UserImage>
              <ImageCentered src={me.photo ? `${me.photo}` : '/imgs/DefaultUserProfile.jpg'} alt="user_photo" />
            </UserImage>
          </UserButton>

          {isModalOpen &&
            me &&
            userContainer &&
            createPortal(
              <LoginNavModal ref={modalRef}>
                <Nav>
                  <StyledNavLink to="/me" onClick={() => setIsModalOpen(false)}>
                    마이페이지
                  </StyledNavLink>

                  <StyledNavButton onClick={handleLogout}>로그아웃</StyledNavButton>
                </Nav>
              </LoginNavModal>,
              userContainer,
            )}
        </>
      ) : (
        <LoginNavLink to="/login">로그인/회원가입</LoginNavLink>
      )}
    </UserContainer>
  );
}

const UserContainer = styled.div`
  display: flex;
  gap: 12px;
  position: relative;
`;

const UserButton = styled.button`
  position: relative;
  border: 2px solid ${({ theme }) => theme.background.box.blue.primary};
  border-radius: 50%;
  cursor: pointer;
`;

const UserImage = styled(RoundedImageWrapper)`
  width: 36px;
  height: 36px;
`;

const LoginNavLink = styled(Link)`
  color: ${({ theme }) => theme.text.white};
  background-color: ${({ theme }) => theme.background.box.blue.primary};
  padding: 4px 8px;
  border-radius: ${({ theme }) => theme.radius.normal};
  ${({ theme }) => theme.fontSize.s14h21}

  &:hover {
    background-color: ${({ theme }) => theme.background.box.blue.hover};
  }

  &:active {
    background-color: ${({ theme }) => theme.background.box.blue.active};
    box-shadow: ${({ theme }) => theme.shadow.inset};
  }
`;

const LoginNavModal = styled.div`
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 24px;
  right: 24px;
  z-index: 20;
`;

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  width: 120px;
  padding: 8px;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.background.box.default.primary};
  box-shadow: ${({ theme }) => theme.shadow.dp03};
`;

const StyledNavLink = styled(Link)`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px 4px;
  border-radius: 12px;
  ${({ theme }) => theme.fontSize.s14h21};

  &:hover {
    background-color: ${({ theme }) => theme.background.box.default.hover};
  }
`;

const StyledNavButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px 4px;
  border-radius: ${({ theme }) => theme.radius.normal};

  ${({ theme }) => theme.fontSize.s14h21};

  &:hover {
    background-color: ${({ theme }) => theme.background.box.default.hover};
  }
`;
