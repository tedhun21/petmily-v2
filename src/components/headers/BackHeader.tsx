import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { FaArrowLeft } from 'react-icons/fa6';
import { Texts20h30 } from 'styles/commonStyle';

interface IProps {
  title?: string;
  link?: string;
}

export default function BackHeader({ title, link }: IProps) {
  const navigate = useNavigate();
  return (
    <Header>
      <StyledButton type="button" onClick={() => (link ? navigate(link) : navigate(-1))}>
        <StyledBackArrow />
      </StyledButton>
      <Title>{title}</Title>
    </Header>
  );
}

const Header = styled.header`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 20px;
  width: 100%;
  height: 64px;
  padding: 20px;
`;

const StyledButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledBackArrow = styled(FaArrowLeft)`
  color: ${({ theme }) => theme.text.highlight};
  width: 24px;
  height: 24px;
`;

const Title = styled(Texts20h30)``;
