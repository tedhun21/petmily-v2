import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

import { useFormContext } from 'react-hook-form';

import { FaXmark } from 'react-icons/fa6';

import { Divider, Row } from 'styles/commonStyle';
import StartTimeOutModal from './StartEndTimeModal';
import { AddText, InputDiv, Label, Modal, Wrapper, XButton } from '../../../../components/headers/SearchBox';

export default function StartEndTimeBox({ isSelected, setIsSelected }: any) {
  const container = document.getElementById('container');
  const modalRef = useRef<HTMLDivElement>(null);

  const { register, setValue, watch } = useFormContext();

  const startTime = watch('startTime');
  const endTime = watch('endTime');

  const handlestartTimeBoxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSelected('startTime');
  };

  const handleendTimeBoxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSelected('endTime');
  };

  const handleInputRemove = () => {
    setValue('startTime', null);
    setValue('endTime', null);
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
      <InputDiv onClick={(e) => handlestartTimeBoxClick(e)} $isSelected={isSelected === 'startTime'}>
        <Wrapper>
          <Label>체크인</Label>
          <AddText $isClicked={startTime?.length > 0}>{startTime ?? '시간 추가'}</AddText>
        </Wrapper>
        {isSelected === 'startTime' && startTime?.length > 0 && (
          <XButton type="button" onClick={handleInputRemove}>
            <FaXmark size="12px" />
          </XButton>
        )}
      </InputDiv>

      <Divider $orientation="vertical" $length="32px" />

      <InputDiv onClick={(e) => handleendTimeBoxClick(e)} $isSelected={isSelected === 'endTime'}>
        <Wrapper>
          <Label>체크아웃</Label>
          <AddText $isClicked={endTime?.length > 0}>{endTime ?? '시간 추가'}</AddText>
        </Wrapper>
        {isSelected === 'endTime' && endTime?.length > 0 && (
          <XButton type="button" onClick={handleInputRemove}>
            <FaXmark size="12px" />
          </XButton>
        )}
      </InputDiv>
      {(isSelected === 'startTime' || isSelected === 'endTime') &&
        container &&
        createPortal(
          <Modal ref={modalRef}>
            <StartTimeOutModal isSelected={isSelected} setIsSelected={setIsSelected} />
          </Modal>,
          container,
        )}
    </Row>
  );
}
