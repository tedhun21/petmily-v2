import React, { useRef } from 'react';
import { createPortal } from 'react-dom';

import { AddText, type FormValues, InputBox, Modal, XButton } from '../SearchBox';
import DateModal from './DateModal';
import { useFormContext } from 'react-hook-form';
import dayjs from 'dayjs';
import { FaXmark } from 'react-icons/fa6';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';
import { ModalType } from '@/store/modalSlice';
import { Text } from '@/components/styled/Text';
import useOutsideClickModal from '@/hooks/useOutsideClickModal';
import Flex from '@/components/styled/Flex';

interface DateBoxProps {
  handleBoxClick: (e: React.MouseEvent, modalType: ModalType) => void;
  handleSetValue: (field: keyof FormValues, value: any) => void;
}

export default function DateBox({ handleBoxClick, handleSetValue }: DateBoxProps) {
  const { currentModal } = useSelector((state: RootState) => state.modal);
  const container = document.getElementById('container');
  const modalRef = useRef<HTMLDivElement | null>(null);
  useOutsideClickModal(modalRef);

  const { setValue, watch } = useFormContext();
  const date = watch('date');

  const handleInputRemove = () => {
    setValue('date', null);
  };

  return (
    <>
      <InputBox
        onClick={(e) => handleBoxClick(e, ModalType.SEARCH_DATE)}
        $selected={currentModal === ModalType.SEARCH_DATE}
      >
        <Flex alignItems="center">
          <Flex direction="column" gap="xs" css={{ flex: 1 }}>
            <Text size="sm">날짜</Text>
            <AddText $isClicked={!!date}>{date ? dayjs(date).format('MM-DD') : '날짜 추가'}</AddText>
          </Flex>
          {currentModal === ModalType.SEARCH_DATE && date && (
            <XButton type="button" onClick={handleInputRemove} css={{ flex: 0 }}>
              <FaXmark size="12px" />
            </XButton>
          )}
        </Flex>
      </InputBox>

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
