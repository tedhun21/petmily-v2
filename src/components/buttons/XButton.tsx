import styled from 'styled-components';
import { FaXmark } from 'react-icons/fa6';
import { Button, ButtonProps } from './Button';

interface XButtonProps extends ButtonProps {
  onClick: () => void;
}

export default function XButton({ onClick, size }: XButtonProps) {
  return (
    <XButtonStyle type="button" onClick={onClick}>
      <FaXmark size={size} />
    </XButtonStyle>
  );
}

const XButtonStyle = styled(Button).attrs(() => ({
  variant: 'icon',
  borderRadius: 'circle',
}))`
  color: ${({ theme }) => theme.colors.text.active};
  background-color: ${({ theme }) => theme.colors.background.box.error.primary};

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.background.box.error.hover};
  }

  &:active:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.background.box.error.active};
  }
`;
