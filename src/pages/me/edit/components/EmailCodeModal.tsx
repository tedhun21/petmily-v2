import { useEffect, useState } from 'react';

import useSWRMutation from 'swr/mutation';

import styled from '@emotion/styled';
import { Modal } from '@mui/material';
import { FaXmark } from 'react-icons/fa6';

import { poster } from '@/api';

export default function EmailCodeModalButton({ email }: { email: string }) {
  const [open, setOpen] = useState(false);

  const { trigger } = useSWRMutation('/mail/code', poster);

  const onToggleModal = () => {
    setOpen((prev) => !prev);
  };

  useEffect(() => {
    if (open && email) {
      trigger({ email });
    }
  }, [open, email]);

  return (
    <>
      <EmailButton type="button" onClick={onToggleModal}>
        <FaXmark color="red" size="20px" />
        <span>인증하기</span>
      </EmailButton>
      <CustomModal open={open} onClose={() => setOpen(false)}>
        <ModalContainer>hi</ModalContainer>
      </CustomModal>
    </>
  );
}

const EmailButton = styled.button`
  display: flex;
  align-items: center;
`;

const CustomModal = styled(Modal)`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContainer = styled.div`
  width: 360px;
  background-color: white;
`;
