import { useEffect, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { createPortal } from 'react-dom';

import { FaXmark } from 'react-icons/fa6';

import { BoxInput, InputDiv, Label, Modal, Wrapper, XButton } from '../../../../components/headers/SearchBox';
import LocationModal from './LocationModal';

export default function LocationBox({ isSelected, setIsSelected, handleSetValue }: any) {
  const container = document.getElementById('container');
  const modalRef = useRef<HTMLDivElement>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  const { register, setValue, watch } = useFormContext();

  const input = watch('location');

  const handleBoxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSelected('location');
  };

  const handleInputRemove = () => {
    setValue('location', null);
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
      <InputDiv onClick={handleBoxClick} $isSelected={isSelected === 'location'}>
        <Wrapper>
          <Label htmlFor="location">장소</Label>
          <BoxInput id="location" placeholder="장소 추가" {...register('location')} autoComplete="off" />
        </Wrapper>
        {isSelected === 'location' && input?.length > 0 && (
          <XButton type="button" onClick={handleInputRemove}>
            <FaXmark size="12px" />
          </XButton>
        )}
      </InputDiv>
      {isSelected === 'location' &&
        container &&
        createPortal(
          <Modal ref={modalRef}>
            <LocationModal
              selectedLocation={selectedLocation}
              setSelectedLocation={setSelectedLocation}
              handleSetValue={handleSetValue}
            />
          </Modal>,
          container,
        )}
    </>
  );
}
