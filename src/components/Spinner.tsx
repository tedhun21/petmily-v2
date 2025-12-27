import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';

type Size = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

interface LoadingProps {
  size?: Size;
  color?: string;
  thickness?: string;
  gap?: number; // 원호의 길이 (0 ~ 100, 기본값 25)
}

const sizeMap: Record<Size, string> = {
  sm: '1.25rem',
  md: '1.5rem',
  lg: '1.75rem',
  xl: '2rem',
  '2xl': '2.5rem',
};

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const Spinner = styled.div<LoadingProps>`
  /* 1. 크기 조절 (size prop) */
  width: ${({ size = 'md' }) => sizeMap[size]};
  height: ${({ size = 'md' }) => sizeMap[size]};
  border-radius: 50%;

  /* 2. 원호의 길이 조절 (gap prop 활용) */
  /* conic-gradient를 사용하여 색상이 칠해지는 범위를 정합니다 */
  background: ${({ color = '#fff', gap = 65 }) => `conic-gradient(${color} ${gap}%, transparent 0)`};

  /* 3. 두께 조절 (thickness) 및 가운데 파내기 */
  /* mask를 사용하면 border-width처럼 가운데를 비워낼 수 있습니다 */
  mask: ${({ thickness = '0.25em' }) =>
    `radial-gradient(farthest-side, transparent calc(100% - ${thickness}), #fff 0)`};
  -webkit-mask: ${({ thickness = '0.25em' }) =>
    `radial-gradient(farthest-side, transparent calc(100% - ${thickness}), #fff 0)`};

  animation: ${spin} 0.75s linear infinite;
  display: inline-block;
`;

export default Spinner;
