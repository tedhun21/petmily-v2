import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

export default function BackButton() {
  const navigate = useNavigate();
  return (
    <StyledBackButton onClick={() => navigate(-1)}>
      <img src="/icons/BackButton.svg" alt="back" width="20" />
    </StyledBackButton>
  );
}

const StyledBackButton = styled.button`
  position: relative;
  z-index: 2;
  border: none;
  background-color: transparent;
  cursor: pointer;
`;
