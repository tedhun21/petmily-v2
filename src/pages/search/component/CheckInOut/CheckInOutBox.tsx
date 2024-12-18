import { Divider, Row } from 'commonStyle';
import { AddText, BoxInput, InputDiv, Label, Modal, Wrapper, XButton } from '../SearchBox';
import { createPortal } from 'react-dom';
import CheckInOutModal from './CheckInOutModal';
import { FaXmark } from 'react-icons/fa6';
import { useFormContext } from 'react-hook-form';
import { useEffect, useRef } from 'react';

export default function CheckInOutBox({ isSelected, setIsSelected }: any) {
  const container = document.getElementById('container');
  const modalRef = useRef<HTMLDivElement>(null);

  const { register, setValue, watch } = useFormContext();

  const checkIn = watch('checkIn');
  const checkOut = watch('checkOut');

  const handleCheckInBoxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSelected('checkIn');
  };

  const handleCheckOutBoxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSelected('checkOut');
  };

  const handleInputRemove = () => {
    setValue('checkIn', null);
    setValue('checkOut', null);
  };

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as Node;

      if (modalRef.current && !modalRef.current.contains(target)) {
        setIsSelected(null);
      }
    };

    document.addEventListener('click', handleOutsideClick);

    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  return (
    <Row style={{ flex: 2, alignItems: 'center' }}>
      <InputDiv onClick={(e) => handleCheckInBoxClick(e)} $isSelected={isSelected === 'checkIn'}>
        <Wrapper>
          <Label>체크인</Label>
          <AddText $isClicked={checkIn?.length > 0}>{checkIn ?? '시간 추가'}</AddText>
        </Wrapper>
        {isSelected === 'checkIn' && checkIn?.length > 0 && (
          <XButton type="button" onClick={handleInputRemove}>
            <FaXmark size="12px" />
          </XButton>
        )}
      </InputDiv>
      <Divider orientation="vertical" length="32px" />
      <InputDiv onClick={(e) => handleCheckOutBoxClick(e)} $isSelected={isSelected === 'checkOut'}>
        <Wrapper>
          <Label>체크아웃</Label>
          <AddText $isClicked={checkOut?.length > 0}>{checkOut ?? '시간 추가'}</AddText>
        </Wrapper>
        {isSelected === 'checkOut' && checkOut?.length > 0 && (
          <XButton type="button" onClick={handleInputRemove}>
            <FaXmark size="12px" />
          </XButton>
        )}
      </InputDiv>
      {(isSelected === 'checkIn' || isSelected === 'checkOut') &&
        container &&
        createPortal(
          <Modal ref={modalRef}>
            <CheckInOutModal isSelected={isSelected} setIsSelected={setIsSelected} />
          </Modal>,
          container,
        )}
    </Row>
  );
}
