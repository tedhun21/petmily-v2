import { useRef } from 'react';
import { createPortal } from 'react-dom';

import { useDispatch, useSelector } from 'react-redux';

import styled from 'styled-components';
import { IoNotificationsOutline } from 'react-icons/io5';

import { RootState } from 'store';
import useOutsideClickModal from 'hooks/useOutsideClickModal';
import { closeModal, ModalType, openModal } from 'store/modalSlice';
import NotiModal from './components/NotiModal';
import { Button } from '@components/buttons/Button';

export default function NotiButton() {
  const dispatch = useDispatch();
  const notiContainer = document.getElementById('noti-container');
  const modalRef = useRef<HTMLDivElement>(null);
  useOutsideClickModal(modalRef);

  const { currentModal } = useSelector((state: RootState) => state.modal);

  const toggleNoti = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (currentModal === ModalType.NOTIFICATION) {
      dispatch(closeModal());
    } else {
      dispatch(openModal(ModalType.NOTIFICATION));
    }
  };

  return (
    <NotiContaier id="noti-container">
      <Button type="button" onClick={toggleNoti} variant="icon" borderRadius="circle">
        <IoNotificationsOutline size="24px" />
      </Button>
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
  top: ${({ theme }) => theme.spacing['2xl']};
  right: ${({ theme }) => theme.spacing['2xl']};
  z-index: 20;
`;
