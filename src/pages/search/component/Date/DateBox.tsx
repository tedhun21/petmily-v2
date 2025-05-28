import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

import { AddText, FormValues, InputDiv, Label, Modal, Wrapper, XButton } from '../SearchBox';
import DateModal from './DateModal';
import { useFormContext } from 'react-hook-form';
import dayjs from 'dayjs';
import { FaXmark } from 'react-icons/fa6';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store';
import { closeModal, ModalType, openModal } from 'store/modalSlice';

interface DateBoxProps {
  handleSetValue: (field: keyof FormValues, value: any) => void;
}

export default function DateBox({ handleSetValue }: DateBoxProps) {
  const dispatch = useDispatch();
  const { currentModal } = useSelector((state: RootState) => state.modal);
  const container = document.getElementById('container');
  const modalRef = useRef<HTMLDivElement | null>(null);

  const { setValue, watch } = useFormContext();
  const date = watch('date');

  const handleDateBoxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(openModal(ModalType.SEARCH_DATE));
  };

  const handleInputRemove = () => {
    setValue('date', null);
  };

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as Node;

      if (modalRef.current && !modalRef.current.contains(target)) {
        dispatch(closeModal()); // 외부 클릭 시 드롭다운 닫기
      }
    };

    document.addEventListener('click', handleOutsideClick);

    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  return (
    <>
      <InputDiv onClick={handleDateBoxClick} $isSelected={currentModal === ModalType.SEARCH_DATE}>
        <Wrapper>
          <Label>날짜</Label>
          <AddText $isClicked={!!date}>{date ? dayjs(date).format('MM-DD') : '날짜 추가'}</AddText>
        </Wrapper>
        {currentModal === ModalType.SEARCH_DATE && date && (
          <XButton type="button" onClick={handleInputRemove}>
            <FaXmark size="12px" />
          </XButton>
        )}
      </InputDiv>

      {currentModal === ModalType.SEARCH_DATE &&
        container &&
        createPortal(
          <Modal ref={modalRef}>
            <DateModal handleSetValue={handleSetValue} />
          </Modal>,
          container,
        )}
    </>
  );
}
