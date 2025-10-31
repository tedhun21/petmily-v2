import styled from 'styled-components';
import { Row, Texts18h28 } from 'styles/commonStyle';
import PawButton from './PawButton';
import { FaRegPaperPlane } from 'react-icons/fa6';
import { Link } from 'react-router-dom';

interface IProps {
  userId: number | null;
}

export default function PawAndMessage({ userId }: IProps) {
  return (
    <Wrapper>
      <PawButton userId={userId} />
      <CustomLink to={`/chats/temp?opponentIds=${userId}`}>
        <Texts18h28>message</Texts18h28>
        <FaRegPaperPlane size="20px" />
      </CustomLink>
    </Wrapper>
  );
}

const Wrapper = styled(Row)`
  gap: ${({ theme }) => theme.spacing.lg};
`;

const CustomLink = styled(Link)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.background.box.default.primary};
  border-radius: ${({ theme }) => theme.radius.md};
  gap: ${({ theme }) => theme.spacing.sm};

  &:hover {
    background-color: ${({ theme }) => theme.colors.background.box.default.hover};
  }

  &:active {
    background-color: ${({ theme }) => theme.colors.background.box.default.active};
    box-shadow: ${({ theme }) => theme.shadow.inset};
  }
`;
