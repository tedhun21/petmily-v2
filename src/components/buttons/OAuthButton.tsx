import { Button } from 'styles/commonStyle';
import styled from 'styled-components';
import { API_URL } from 'config';

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
      <div>{children}</div>
    </GoogleOAuthButtonStyle>
  );
}

const GoogleOAuthButtonStyle = styled(Button)`
  position: relative;
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.line.box.primary};
  border-radius: ${({ theme }) => theme.radius.md} div {
    color: ${({ theme }) => theme.colors.text.active};
    ${({ theme }) => theme.typeScale.base};
  }
`;

const GoogleImage = styled.img`
  position: absolute;
  top: ${({ theme }) => theme.spacing.sm};
  left: ${({ theme }) => theme.spacing.sm};
`;
