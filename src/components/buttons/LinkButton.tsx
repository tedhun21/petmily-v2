import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

interface ButtonProps {
  text: string;
  fontSize?: string;
  link: string;
  width?: string;
  height?: string;
  onClick?: () => void; // onClick prop 추가
}

export default function LinkButton({ text, fontSize = '14', link, width, height, onClick }: ButtonProps) {
  const navigate = useNavigate();
  const handleClick = () => {
    if (link) {
      navigate(link);
    }
    if (onClick) {
      // 외부에서 전달받은 OnClick이 있으면 실행
      onClick();
    }
  };
  return (
    <StyledLinkButton fontSize={fontSize} onClick={handleClick} width={width} height={height}>
      <a href={link}>{text}</a>
    </StyledLinkButton>
  );
}

const StyledLinkButton = styled.button<{ fontSize: string; width: any; height: any }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px 8px;
  border: none;
  border-radius: 4px;
  font-size: ${({ fontSize }) => `${fontSize}px`};
  background-color: ${({ theme }) => theme.background.box.blue.primary};
  width: ${(props) => props.width || 'auto'}; //기본값 'auto'
  height: ${(props) => props.height || 'auto'}; //기본값 'auto'

  &:hover {
    background-color: ${({ theme }) => theme.background.box.blue.hover};
  }

  &:active {
    box-shadow:${({ theme }) => theme.shadow.inset}
    background-color: ${({ theme }) => theme.background.box.blue.active};
  }

  a {
    text-decoration: none;
    color: white;
    flex-shrink: 0;

    &:visited {
      text-decoration: none;
    }
  }
`;
