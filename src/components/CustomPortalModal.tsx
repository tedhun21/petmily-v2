import { createPortal } from 'react-dom';
import styled from '@emotion/styled';

interface IProps {
  children: React.ReactNode;
  onClose: () => void;
  style?: { width?: string; height?: string };
}

export default function CustomPortalModal({ children, onClose, style }: IProps) {
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const modalContainer = document.getElementById('modal-root');

  if (!modalContainer) {
    return null;
  }

  return createPortal(
    <Backdrop onClick={handleBackdropClick}>
      <ContentBox style={style}>{children}</ContentBox>
    </Backdrop>,
    modalContainer,
  );
}

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

const ContentBox = styled.div`
  background-color: ${({ theme }) => theme.colors.background.layer1};
  border-radius: 8px;
  overflow: hidden;
`;
