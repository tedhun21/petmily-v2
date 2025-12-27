import styled from '@emotion/styled';
import { Link } from 'react-router-dom';
import { FaRegPaperPlane } from 'react-icons/fa6';

import PawButton from './PawButton';
import Text from '@/components/styled/Text';
import Flex from '@/components/styled/Flex';

interface IProps {
  userId: number | null;
}

export default function PawAndMessage({ userId }: IProps) {
  return (
    <Flex gap="lg">
      <PawButton userId={userId} />
      <CustomLink to={`/chats/temp?opponentIds=${userId}`}>
        <Text size="lg">message</Text>
        <FaRegPaperPlane size="20px" />
      </CustomLink>
    </Flex>
  );
}

// TODO
const CustomLink = styled(Link)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: ${({ theme }) => theme.space.sm};
  background-color: ${({ theme }) => theme.colors.background.box.default.primary};
  border-radius: ${({ theme }) => theme.radius.md};
  gap: ${({ theme }) => theme.space.sm};

  &:hover {
    background-color: ${({ theme }) => theme.colors.background.box.default.hover};
  }

  &:active {
    background-color: ${({ theme }) => theme.colors.background.box.default.active};
    box-shadow: ${({ theme }) => theme.shadow.inset};
  }
`;
