import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { FaArrowLeft } from 'react-icons/fa6';
import { Title } from 'styles/commonStyle';

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
  display: flex;
  flex: 1;
  align-items: center;
  width: 100%;
  height: 64px;
  padding: ${({ theme }) => theme.spacing.xl};
  gap: ${({ theme }) => theme.spacing.xl};
`;

const StyledButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledBackArrow = styled(FaArrowLeft)`
  width: 24px;
  height: 24px;
  color: ${({ theme }) => theme.colors.text.highlight};
`;
