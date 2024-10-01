import styled, { keyframes } from 'styled-components';

interface LoadingProps {
  color?: string;
}

export const Loading = ({ color = 'white' }: LoadingProps) => {
  return <Spinner $color={color} />;
};

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Spinner = styled.div<{ $color: string }>`
  border: 4px solid transparent;
  border-top: 4px solid ${(props) => props.$color};
  border-right: 4px solid ${(props) => props.$color};
  border-bottom: 4px solid ${(props) => props.$color};
  border-radius: 50%;
  width: 32px;
  height: 32px;
  animation: ${spin} 1s linear infinite;
`;
