import styled, { keyframes } from 'styled-components';

interface LoadingProps {
  size?: string;
  color?: string;
}

export default function Loading({ size = '32px', color = 'white' }: LoadingProps) {
  return <Spinner $size={size} $color={color} />;
}

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const Spinner = styled.div<{ $size: string; $color: string }>`
  border: 4px solid rgba(0, 0, 0, 0.1); /* 배경 색상 */
  border-top: 4px solid ${(props) => props.$color}; /* 스피너 색상 */
  border-radius: 50%;
  width: ${(props) => props.$size};
  height: ${(props) => props.$size};
  animation: ${spin} 1s linear infinite; /* 회전 애니메이션 */
`;
