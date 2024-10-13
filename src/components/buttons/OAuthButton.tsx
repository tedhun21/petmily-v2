import styled from 'styled-components';

interface Props {
  children: string;
}

const API_URL = process.env.REACT_APP_API_URL;

export default function GoogleOAuthButton({ children }: Props) {
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

const GoogleOAuthButtonStyle = styled.button`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;

  padding: 8px;
  border: 1px solid ${({ theme }) => theme.textColors.gray40};
  border-radius: 8px;
  color: ${({ theme }) => theme.textColors.gray60};
  background-color: white;
  font-family: inherit;

  &:hover {
    background-color: ${({ theme }) => theme.textColors.primary};
  }

  &:active {
    background-color: ${({ theme }) => theme.textColors.gray50};
    box-shadow: ${({ theme }) => theme.shadow.inset};
  }

  div {
    color: ${({ theme }) => theme.textColors.gray40};
    ${({ theme }) => theme.fontSize.s16h24};
  }
`;

const GoogleImage = styled.img`
  position: absolute;
  top: 8px;
  left: 8px;
`;
