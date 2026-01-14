import React, { useRef } from 'react';
import { createPortal } from 'react-dom';

import { useFormContext } from 'react-hook-form';

import { FaXmark } from 'react-icons/fa6';

import StartEndTimeModal from './StartEndTimeModal';
import { AddText, type FormValues, InputBox, Modal } from '../SearchBox';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';
import { ModalType } from '@/store/modalSlice';
import Box from '@/components/styled/Box';
import { FiSearch } from 'react-icons/fi';
import Flex from '@/components/styled/Flex';
import Text from '@/components/styled/Text';
import useOutsideClickModal from '@/hooks/useOutsideClickModal';
import { colors } from '@/styles/colors';
import { IconButton } from '@/components/styled/IconButtonAndLink';

interface IProps {
  handleBoxClick: (e: React.MouseEvent, modalType: ModalType) => void;
  handleSetValue: (field: keyof FormValues, value: string) => void;
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
            <IconButton type="button" onClick={handleInputRemove}>
              <FaXmark size="12px" />
            </IconButton>
          )}
          <Box css={{ flex: 0 }}>
            <IconButton
              type="submit"
              bgColor={colors.blue400}
              onClick={(e) => e.stopPropagation()}
            >
              <FiSearch size="24px" color={colors.white} />
            </IconButton>
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
