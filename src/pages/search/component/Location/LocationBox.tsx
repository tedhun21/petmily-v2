import { useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { createPortal } from 'react-dom';

import { useSelector } from 'react-redux';
import { ModalType } from '@/store/modalSlice';
import type { RootState } from '@/store';

import { FaXmark } from 'react-icons/fa6';

import { BoxInput, type FormValues, InputBox, Modal } from '../SearchBox';
import LocationModal from './LocationModal';
import Flex from '@/components/styled/Flex';
import useOutsideClickModal from '@/hooks/useOutsideClickModal';
import Text from '@/components/styled/Text';
import { IconButton } from '@/components/styled/IconButtonAndLink';

interface LocationBoxProps {
  handleBoxClick: (e: React.MouseEvent, modalType: ModalType) => void;
  handleSetValue: (field: keyof FormValues, value: string) => void;
}

export default function LocationBox({ handleBoxClick, handleSetValue }: LocationBoxProps) {
  const { currentModal } = useSelector((state: RootState) => state.modal);
  const container = document.getElementById('container');
  const modalRef = useRef<HTMLDivElement>(null);
  useOutsideClickModal(modalRef);

  const { register, setValue, watch } = useFormContext();

  const input = watch('location');

  const handleInputRemove = () => {
    setValue('location', null);
  };

  return (
    <>
      <InputBox
        onClick={(e) => handleBoxClick(e, ModalType.SEARCH_LOCATION)}
        $selected={currentModal === ModalType.SEARCH_LOCATION}
      >
        <Flex alignItems="center">
          <Flex direction="column" gap="xs" css={{ flex: 1 }}>
            <label htmlFor="location">
              <Text size="sm">장소</Text>
            </label>
            <BoxInput id="location" placeholder="장소 추가" {...register('location')} autoComplete="off" />
          </Flex>
          {currentModal === ModalType.SEARCH_LOCATION && input?.length > 0 && (
            <IconButton type="button" onClick={handleInputRemove}>
              <FaXmark size="12px" />
            </IconButton>
          )}
        </Flex>
      </InputBox>
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
