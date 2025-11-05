import styled from 'styled-components';
import { API_URL } from 'config';
import { Button } from './Button';
import { Texts16h24 } from 'styles/commonStyle';
import { InputProps } from '@components/Input';

interface GoogleOAuthButtonProps extends InputProps {
  children: React.ReactNode;
}

export default function GoogleOAuthButton({ children, $size, $borderRadius }: GoogleOAuthButtonProps) {
  const handleGooleOAuth = () => {
    window.location.assign(`${API_URL}/connect/google`);
  };
  return (
    <GoogleOAuthButtonStyle type="button" onClick={handleGooleOAuth} $size={$size} $borderRadius={$borderRadius}>
      <GoogleImage src="/imgs/GoogleLogo.svg" alt="google logo" width="24" />
      <Texts16h24>{children}</Texts16h24>
    </GoogleOAuthButtonStyle>
  );
}

const GoogleOAuthButtonStyle = styled(Button).attrs((props) => ({
  $variant: 'secondary',
  $size: props.$size,
  $borderRadius: props.$borderRadius,
}))`
  position: relative;
  span {
    color: ${({ theme }) => theme.colors.text.active};
  }
`;

const GoogleImage = styled.img`
  position: absolute;
  top: 50%;
  left: ${({ theme }) => theme.spacing.md};
  transform: translateY(-50%);
`;
