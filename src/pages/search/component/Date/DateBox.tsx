import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

import { AddText, InputDiv, Label, Modal, Wrapper, XButton } from '../SearchBox';
import DateModal from './DateModal';
import { useFormContext } from 'react-hook-form';
import dayjs from 'dayjs';
import { FaXmark } from 'react-icons/fa6';

export default function DateBox({ isSelected, setIsSelected }: any) {
  const container = document.getElementById('container');

  const modalRef = useRef<HTMLDivElement | null>(null);

  const { setValue, watch } = useFormContext();
  const date = watch('date');

  const handleDateBoxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSelected('date');
  };

  const handleInputRemove = () => {
    setValue('date', null);
  };

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as Node;

      if (modalRef.current && !modalRef.current.contains(target)) {
        setIsSelected(null); // 외부 클릭 시 드롭다운 닫기
      }
    };

    document.addEventListener('click', handleOutsideClick);

    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  return (
    <>
      <InputDiv onClick={handleDateBoxClick} $isSelected={isSelected === 'date'}>
        <Wrapper>
          <Label>날짜</Label>
          <AddText $isClicked={!!date}>{date ? dayjs(date).format('MM-DD') : '날짜 추가'}</AddText>
        </Wrapper>
        {isSelected === 'date' && date && (
          <XButton type="button" onClick={handleInputRemove}>
            <FaXmark size="12px" />
          </XButton>
        )}
      </InputDiv>

      {isSelected === 'date' &&
        container &&
        createPortal(
          <Modal ref={modalRef}>
            <DateModal />
          </Modal>,
          container,
        )}
    </>
  );
}
