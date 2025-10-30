import styled from 'styled-components';
import { Row, Texts18h27 } from 'styles/commonStyle';
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
        <Texts18h27>message</Texts18h27>
        <FaRegPaperPlane size="20px" />
      </CustomLink>
    </Wrapper>
  );
}

const Wrapper = styled(Row)`
  gap: 16px;
`;

const CustomLink = styled(Link)`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px;

  border-radius: ${({ theme }) => theme.radius.normal};

  background-color: ${({ theme }) => theme.background.box.default.primary};

  &:hover {
    background-color: ${({ theme }) => theme.background.box.default.hover};
  }

  &:active {
    background-color: ${({ theme }) => theme.background.box.default.active};
    box-shadow: ${({ theme }) => theme.shadow.inset};
  }
`;
