import { FaArrowLeft } from 'react-icons/fa6';
import styled from 'styled-components';

import { Button } from './Button';
import { useNavigate } from 'react-router-dom';

interface IProps {
  link?: string;
}

export default function BackButton({ link }: IProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    return link ? navigate(link) : navigate(-1);
  };
  return (
    <Button type="button" onClick={handleClick} $variant="icon" $borderRadius="circle">
      <StyledBackArrow size="28px" />
    </Button>
  );
}

const StyledBackArrow = styled(FaArrowLeft)`
  color: ${({ theme }) => theme.colors.text.highlight};
`;
