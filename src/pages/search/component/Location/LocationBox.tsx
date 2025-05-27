import { useEffect, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { createPortal } from 'react-dom';

import { FaXmark } from 'react-icons/fa6';

import { BoxInput, InputDiv, Label, Modal, Wrapper, XButton } from '../SearchBox';
import LocationModal from './LocationModal';
import { useDispatch, useSelector } from 'react-redux';
import { closeModal, ModalType, openModal } from 'store/modalSlice';
import { RootState } from 'store';

interface LocationBoxProps {
  handleSetValue: (field: string, value: string) => void;
}

export default function LocationBox({ handleSetValue }: LocationBoxProps) {
  const dispatch = useDispatch();
  const { currentModal } = useSelector((state: RootState) => state.modal);
  const container = document.getElementById('container');
  const modalRef = useRef<HTMLDivElement>(null);

  const { register, setValue, watch } = useFormContext();

  const input = watch('location');

  const handleBoxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(openModal(ModalType.SEARCH_LOCATION));
  };

  const handleInputRemove = () => {
    setValue('location', null);
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
      <InputDiv onClick={handleBoxClick} $isSelected={currentModal === ModalType.SEARCH_LOCATION}>
        <Wrapper>
          <Label htmlFor="location">장소</Label>
          <BoxInput id="location" placeholder="장소 추가" {...register('location')} autoComplete="off" />
        </Wrapper>
        {currentModal === ModalType.SEARCH_LOCATION && input?.length > 0 && (
          <XButton type="button" onClick={handleInputRemove}>
            <FaXmark size="12px" />
          </XButton>
        )}
      </InputDiv>
      {currentModal === ModalType.SEARCH_LOCATION &&
        container &&
        createPortal(
          <Modal ref={modalRef}>
            <LocationModal handleSetValue={handleSetValue} />
          </Modal>,
          container,
        )}
    </>
  );
}
