import styled from '@emotion/styled';
import { API_URL } from '@/config';
import { Button, ButtonProps } from '../styled/Button';
import { Text } from '@components/styled/Text';

interface GoogleOAuthButtonProps extends ButtonProps {
  children: React.ReactNode;
}

export default function GoogleOAuthButton({ children }: GoogleOAuthButtonProps) {
  const handleGooleOAuth = () => {
    window.location.assign(`${API_URL}/connect/google`);
  };
  return (
    <GoogleOAuthButtonStyle type="button" onClick={handleGooleOAuth} variant="secondary" fullWidth>
      <GoogleImage src="/imgs/GoogleLogo.svg" alt="google logo" width="24" />
      <Text size="base" color="active">
        {children}
      </Text>
    </GoogleOAuthButtonStyle>
  );
}

const GoogleOAuthButtonStyle = styled(Button)`
  position: relative;
`;

const GoogleImage = styled.img`
  position: absolute;
  top: 50%;
  left: ${({ theme }) => theme.spacing.md};
  transform: translateY(-50%);
`;
