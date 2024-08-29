import styled, { keyframes } from 'styled-components';

interface LoadingProps {
  size: string;
}

export const Loading = ({ size }: LoadingProps) => {
  return (
    <Container size={size}>
      <Spinner />
    </Container>
  );
};

const Container = styled.div<LoadingProps>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
`;

const spin = keyframes`
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  `;

const Spinner = styled.div`
  width: 100%;
  height: 100%;
  border: 2px solid rgb(255 255 255 / 60%);
  border-radius: 50%;
  animation: ${spin} 1.2s linear infinite;
  border-top: 2px solid #fff;
`;
