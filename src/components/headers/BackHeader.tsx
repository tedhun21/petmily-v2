import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { FaArrowLeft } from 'react-icons/fa6';

interface IProps {
  link?: string;
}

export default function BackHeader({ link }: IProps) {
  const navigate = useNavigate();
  return (
    <Container>
      <StyledBackButton onClick={() => (link ? navigate(link) : navigate(-1))}>
        <FaArrowLeft color="#279EFF" size="24px" />
      </StyledBackButton>
    </Container>
  );
}

const Container = styled.header`
  display: flex;
  align-item: center;
  width: 100%;
  height: 64px;
  padding: 20px;
`;

const StyledBackButton = styled.button`
  z-index: 2;
  border: none;
  background-color: transparent;
  cursor: pointer;
`;
