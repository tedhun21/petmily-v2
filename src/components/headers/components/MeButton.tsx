import { useRef } from 'react';

import { toast } from 'react-toastify';
import { createPortal } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';

import { useAuthSWRMutation } from 'hooks/authSWR';
import styled from 'styled-components';

import { poster } from 'api';
import { RootState } from 'store';
import { User } from 'types/user.type';
import { clearAccessToken } from 'store/authSlice';
import useOutsideClickModal from 'hooks/useOutsideClickModal';
import { closeModal, ModalType, openModal } from 'store/modalSlice';
import { ImageCentered, RoundedImageWrapper } from 'styles/commonStyle';

interface MeButtonProps {
  me?: User;
}

export default function MeButton({ me }: MeButtonProps) {
  const userContainer = document.getElementById('user-container');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentModal } = useSelector((state: RootState) => state.modal);

  const modalRef = useRef<HTMLDivElement | null>(null);
  useOutsideClickModal(modalRef);

  // 로그아웃
  const { trigger } = useAuthSWRMutation('/auth/logout', poster, {
    onSuccess: () => {
      dispatch(clearAccessToken()); // Redux 스토어에서 액세스 토큰 제거
      toast.success('로그아웃 되었습니다.');
      navigate('/'); // 로그인 페이지 또는 홈으로 리다이렉션
    },
    onError: () => {
      toast.error('로그아웃에 실패했습니다. 다시 시도해주세요.');
      dispatch(clearAccessToken());
      navigate('/');
    },
  });

  const toggleMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // 이벤트 전파를 막음

    if (currentModal === ModalType.ME_BUTTON) {
      dispatch(closeModal());
    } else {
      dispatch(openModal(ModalType.ME_BUTTON));
    }
  };

  // 로그아웃 처리
  const handleLogout = async () => {
    await trigger();
  };

  return (
    <UserContainer id="user-container">
      <UserButton type="button" onClick={toggleMenu}>
        <UserImage>
          <ImageCentered src={me?.photo ? `${me?.photo}` : '/imgs/DefaultUserProfile.jpg'} alt="user_photo" />
        </UserImage>
      </UserButton>

      {currentModal === ModalType.ME_BUTTON &&
        me &&
        userContainer &&
        createPortal(
          <LoginNavModal ref={modalRef}>
            <Nav>
              <StyledNavLink to="/me" onClick={() => dispatch(closeModal())}>
                마이페이지
              </StyledNavLink>

              <StyledNavButton onClick={handleLogout}>로그아웃</StyledNavButton>
            </Nav>
          </LoginNavModal>,
          userContainer,
        )}
    </UserContainer>
  );
}

const UserContainer = styled.div`
  position: relative;
  display: flex;
  gap: 12px;
`;

const UserButton = styled.button`
  position: relative;
  border: 2px solid ${({ theme }) => theme.colors.background.box.blue.primary};
  border-radius: 50%;
  cursor: pointer;
`;

const UserImage = styled(RoundedImageWrapper)`
  width: 36px;
  height: 36px;
`;

const LoginNavModal = styled.div`
  position: absolute;
  top: 24px;
  right: 24px;
  z-index: 20;
  justify-content: center;
  align-items: center;
`;

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  width: 120px;
  padding: 8px;
  background-color: ${({ theme }) => theme.colors.background.box.default.primary};
  border-radius: 12px;
  box-shadow: ${({ theme }) => theme.shadow.dp03};
`;

const StyledNavLink = styled(Link)`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px 4px;
  border-radius: 12px;
  ${({ theme }) => theme.typeScale.sm};

  &:hover {
    background-color: ${({ theme }) => theme.colors.background.box.default.hover};
  }
`;

const StyledNavButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px 4px;
  border-radius: ${({ theme }) => theme.radius.base};

  ${({ theme }) => theme.typeScale.sm};

  &:hover {
    background-color: ${({ theme }) => theme.colors.background.box.default.hover};
  }
`;
