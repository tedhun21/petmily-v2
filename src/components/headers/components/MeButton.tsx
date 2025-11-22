import { useRef } from 'react';

import { toast } from 'react-toastify';
import { createPortal } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import { useAuthSWRMutation } from '@/hooks/authSWR';
import styled from '@emotion/styled';

import { poster } from '@/api';
import { RootState } from '@/store';
import { User } from '@/types/user.type';
import { clearAccessToken } from '@/store/authSlice';
import useOutsideClickModal from '@/hooks/useOutsideClickModal';
import { closeModal, ModalType, openModal } from '@/store/modalSlice';
import { ImageCentered, RoundedImageWrapper } from '@/styles/commonStyle';
import { Button } from '@/components/styled/Button';

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

  const handleMenuClick = () => {
    dispatch(closeModal());
  };

  // 로그아웃 처리
  const handleLogout = async () => {
    handleMenuClick();
    await trigger();
  };

  return (
    <div id="user-container">
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
              {/* TODO: Button style link? */}
              <Link to="/me" onClick={handleMenuClick} type="text">
                내 정보
              </Link>
              <Button type="button" onClick={handleLogout} variant="transparent" borderRadius="sm">
                로그아웃
              </Button>
            </Nav>
          </LoginNavModal>,
          userContainer,
        )}
    </div>
  );
}

const UserButton = styled.button`
  position: relative;
  padding: 2px;
  border: 2px solid ${({ theme }) => theme.colors.background.box.accent.primary};
  border-radius: ${({ theme }) => theme.radius.circle};
  cursor: pointer;
`;

const UserImage = styled(RoundedImageWrapper)`
  width: 36px;
  height: 36px;
`;

const LoginNavModal = styled.div`
  position: absolute;
  top: ${({ theme }) => theme.spacing['2xl']};
  right: ${({ theme }) => theme.spacing['2xl']};
  z-index: 20;
  justify-content: center;
  align-items: center;
`;

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  width: 120px;
  padding: ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.background.box.default.primary};
  border-radius: ${({ theme }) => theme.radius.md};
  box-shadow: ${({ theme }) => theme.shadow.dp03};
`;
