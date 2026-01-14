import { useRef } from 'react';
import { createPortal } from 'react-dom';

import { useDispatch, useSelector } from 'react-redux';

import styled from '@emotion/styled';
import { IoNotificationsOutline } from 'react-icons/io5';

import type { RootState } from '@/store';
import useOutsideClickModal from '@/hooks/useOutsideClickModal';
import { closeModal, ModalType, openModal } from '@/store/modalSlice';
import NotiModal from './components/NotiModal';
import { IconButton } from '@/components/styled/IconButtonAndLink';

export default function NotiButton() {
  const dispatch = useDispatch();
  const notiContainer = document.getElementById('noti-container');
  const modalRef = useRef<HTMLDivElement>(null);
  useOutsideClickModal(modalRef);

  const { currentModal } = useSelector((state: RootState) => state.modal);

  const toggleNoti = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentModal === ModalType.NOTIFICATION) {
      dispatch(closeModal());
    } else {
      dispatch(openModal(ModalType.NOTIFICATION));
    }
  };

  return (
    <NotiContaier id="noti-container">
      <IconButton type="button" onClick={toggleNoti} variant="clear" size="sm" shape="circle">
        <IoNotificationsOutline size="24px" />
      </IconButton>
      {currentModal === ModalType.NOTIFICATION &&
        notiContainer &&
        createPortal(
          <Modal ref={modalRef}>
            <NotiModal />
          </Modal>,
          notiContainer,
        )}
    </NotiContaier>
  );
}

const NotiContaier = styled.div`
  position: relative;
`;

const Modal = styled.div`
  position: absolute;
  top: ${({ theme }) => theme.space['2xl']};
  right: ${({ theme }) => theme.space['2xl']};
  z-index: 20;
`;
