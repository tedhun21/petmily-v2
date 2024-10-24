import { Modal } from '@mui/material';
import { fetcherWithCookie, poster } from 'api';
import { useEffect, useState } from 'react';
import { FaXmark } from 'react-icons/fa6';
import styled from 'styled-components';
import useSWRMutation from 'swr/mutation';

const API_URL = process.env.REACT_APP_API_URL;

export default function EmailCodeModalButton({ email }: { email: string }) {
  const [open, setOpen] = useState(false);

  const { trigger } = useSWRMutation(`${API_URL}/mail/code`, poster);

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
