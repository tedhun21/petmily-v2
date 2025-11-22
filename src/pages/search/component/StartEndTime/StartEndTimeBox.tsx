import { useRef } from 'react';
import { createPortal } from 'react-dom';

import { useFormContext } from 'react-hook-form';

import { FaXmark } from 'react-icons/fa6';

import StartEndTimeModal from './StartEndTimeModal';
import { AddText, FormValues, InputBox, Modal, XButton } from '../SearchBox';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { ModalType } from '@/store/modalSlice';
import Box from '@components/styled/Box';
import { Button } from '@/components/styled/Button';
import { FiSearch } from 'react-icons/fi';
import Flex from '@components/styled/Flex';
import { Text } from '@components/styled/Text';
import useOutsideClickModal from '@/hooks/useOutsideClickModal';

interface IProps {
  handleBoxClick: (e: React.MouseEvent, modalType: ModalType) => void;
  handleSetValue: (field: keyof FormValues, value: any) => void;
}

export default function StartEndTimeBox({ handleBoxClick, handleSetValue }: IProps) {
  const { currentModal } = useSelector((state: RootState) => state.modal);
  const container = document.getElementById('container');
  const modalRef = useRef<HTMLDivElement>(null);
  useOutsideClickModal(modalRef);

  const { setValue, watch } = useFormContext();

  const startTime = watch('startTime');
  const endTime = watch('endTime');

  const handleInputRemove = () => {
    setValue('startTime', null);
    setValue('endTime', null);
  };

  const dateText = (startTime: string, endTime: string) => {
    if (startTime && endTime) {
      return `${startTime} - ${endTime}`;
    }
    if (startTime) {
      return `${startTime}`;
    }
    return '시간 추가';
  };

  return (
    <>
      <InputBox
        onClick={(e) => handleBoxClick(e, ModalType.SEARCH_TIME)}
        $selected={currentModal === ModalType.SEARCH_TIME}
      >
        <Flex alignItems="center">
          <Flex direction="column" gap="xs" css={{ flex: 1 }}>
            <Text size="sm">시간</Text>
            <AddText $isClicked={startTime?.length > 0}>{dateText(startTime, endTime)}</AddText>
          </Flex>
          {currentModal === ModalType.SEARCH_TIME && startTime?.length > 0 && (
            <XButton type="button" onClick={handleInputRemove}>
              <FaXmark size="12px" />
            </XButton>
          )}
          <Box css={{ flex: 0 }}>
            <Button type="submit" variant="icon" borderRadius="circle" style={{ backgroundColor: '#279EFF' }}>
              <FiSearch size="24px" color="white" />
            </Button>
          </Box>
        </Flex>
      </InputBox>

      {currentModal === ModalType.SEARCH_TIME &&
        container &&
        createPortal(
          <Modal ref={modalRef}>
            <StartEndTimeModal handleSetValue={handleSetValue} />
          </Modal>,
          container,
        )}
    </>
  );
}
