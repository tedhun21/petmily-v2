import styled, { keyframes } from 'styled-components';

interface LoadingProps {
  size: string;
  color?: string;
}

export const Loading = ({ size, color }: LoadingProps) => {
  return (
    <Container size={size}>
      <Spinner color={color} />
    </Container>
  );
};

const Container = styled.div<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
`;

const spin = keyframes`
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  `;

const Spinner = styled.div<{ color?: string }>`
  width: 100%;
  height: 100%;
  border: 2px solid ${({ color = 'white' }) => color}; // Default to white if no color is provided
  border-radius: 50%;
  animation: ${spin} 1.2s linear infinite;
  // border-top: 2px solid rgba(255, 255, 255, 0.6); // Use RGBA notation for 60% opacity white
`;
