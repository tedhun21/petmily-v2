import { Button } from 'commonStyle';
import styled from 'styled-components';

const API_URL = process.env.REACT_APP_API_URL;

export default function GoogleOAuthButton({ children }: any) {
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

  div {
    color: ${({ theme }) => theme.text.secondary};
    ${({ theme }) => theme.fontSize.s16h24};
  }
`;

const GoogleImage = styled.img`
  position: absolute;
  top: 8px;
  left: 8px;
`;
