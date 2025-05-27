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
  padding: 8px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.line.box.primary};

  div {
    color: ${({ theme }) => theme.text.active};
    ${({ theme }) => theme.fontSize.s16h24};
  }
`;

const GoogleImage = styled.img`
  position: absolute;
  top: 8px;
  left: 8px;
`;
