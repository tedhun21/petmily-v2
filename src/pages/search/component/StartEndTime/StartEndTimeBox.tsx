import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

import { useFormContext } from 'react-hook-form';

import { FaXmark } from 'react-icons/fa6';

import { Divider, Row } from 'styles/commonStyle';
import StartTimeOutModal from './StartEndTimeModal';
import { AddText, InputDiv, Label, Modal, Wrapper, XButton } from '../SearchBox';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store';
import { closeModal, ModalType, openModal } from 'store/modalSlice';

export default function StartEndTimeBox() {
  const dispatch = useDispatch();
  const { currentModal } = useSelector((state: RootState) => state.modal);
  const container = document.getElementById('container');
  const modalRef = useRef<HTMLDivElement>(null);

  const { setValue, watch } = useFormContext();

  const startTime = watch('startTime');
  const endTime = watch('endTime');

  const handlestartTimeBoxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(openModal(ModalType.SEARCH_START_TIME));
  };

  const handleendTimeBoxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(openModal(ModalType.SEARCH_END_TIME));
  };

  const handleInputRemove = () => {
    setValue('startTime', null);
    setValue('endTime', null);
  };

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as Node;

      if (modalRef.current && !modalRef.current.contains(target)) {
        dispatch(closeModal());
      }
    };

    document.addEventListener('click', handleOutsideClick);

    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  return (
    <Row style={{ flex: 2, alignItems: 'center' }}>
      <InputDiv onClick={(e) => handlestartTimeBoxClick(e)} $isSelected={currentModal === ModalType.SEARCH_START_TIME}>
        <Wrapper>
          <Label>체크인</Label>
          <AddText $isClicked={startTime?.length > 0}>{startTime ?? '시간 추가'}</AddText>
        </Wrapper>
        {currentModal === ModalType.SEARCH_START_TIME && startTime?.length > 0 && (
          <XButton type="button" onClick={handleInputRemove}>
            <FaXmark size="12px" />
          </XButton>
        )}
      </InputDiv>

      <Divider $orientation="vertical" $length="32px" />

      <InputDiv onClick={(e) => handleendTimeBoxClick(e)} $isSelected={currentModal === ModalType.SEARCH_END_TIME}>
        <Wrapper>
          <Label>체크아웃</Label>
          <AddText $isClicked={endTime?.length > 0}>{endTime ?? '시간 추가'}</AddText>
        </Wrapper>
        {currentModal === ModalType.SEARCH_END_TIME && endTime?.length > 0 && (
          <XButton type="button" onClick={handleInputRemove}>
            <FaXmark size="12px" />
          </XButton>
        )}
      </InputDiv>
      {(currentModal === ModalType.SEARCH_START_TIME || currentModal === ModalType.SEARCH_END_TIME) &&
        container &&
        createPortal(
          <Modal ref={modalRef}>
            <StartTimeOutModal />
          </Modal>,
          container,
        )}
    </Row>
  );
}
