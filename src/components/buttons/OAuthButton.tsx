import styled from 'styled-components';
import { API_URL } from 'config';
import { Button } from './Button';
import { Texts16h24 } from 'styles/commonStyle';

interface GoogleOAuthButtonProps {
  children: React.ReactNode;
}

export default function GoogleOAuthButton({ children }: GoogleOAuthButtonProps) {
  const handleGooleOAuth = () => {
    window.location.assign(`${API_URL}/connect/google`);
  };
  return (
    <GoogleOAuthButtonStyle type="button" onClick={handleGooleOAuth}>
      <GoogleImage src="/imgs/GoogleLogo.svg" alt="google logo" width="24" />
      <Texts16h24>{children}</Texts16h24>
    </GoogleOAuthButtonStyle>
  );
}

const GoogleOAuthButtonStyle = styled(Button).attrs(() => ({
  $variant: 'secondary',
}))`
  position: relative;
  span {
    color: ${({ theme }) => theme.colors.text.active};
  }
`;

const GoogleImage = styled.img`
  position: absolute;
  top: ${({ theme }) => theme.spacing.sm};
  left: ${({ theme }) => theme.spacing.sm};
`;
