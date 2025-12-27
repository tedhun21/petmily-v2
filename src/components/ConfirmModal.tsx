import styled from '@emotion/styled';

import CustomPortalModal from './CustomPortalModal';

import Button from './styled/Button';
import Box from './styled/Box';
import Flex from './styled/Flex';
import Text from './styled/Text';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  children: React.ReactNode;
}

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, children }: ConfirmModalProps) {
  if (!isOpen) {
    return null;
  }

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <CustomPortalModal onClose={onClose}>
      <Container>
        <Box p="xl">
          <Flex justifyContent="center">
            <Text size="xl">{title}</Text>
          </Flex>

          <Box p="lg">{children}</Box>

          <Flex gap="lg">
            <Button onClick={() => onClose()} variant="error" fullWidth>
              취소
            </Button>
            <Button onClick={handleConfirm} variant="primary" fullWidth>
              확인
            </Button>
          </Flex>
        </Box>
      </Container>
    </CustomPortalModal>
  );
}

const Container = styled.div`
  width: 360px;
  background-color: ${({ theme }) => theme.colors.background.layer1};
`;
