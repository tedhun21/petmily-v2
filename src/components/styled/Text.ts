import styled from '@emotion/styled';
import type { Theme } from '@/styles/theme';
import { get } from 'react-hook-form';

type TextProps = {
  size?: keyof Theme['typeScale'];
  weight?: keyof Theme['fontWeight'];
  color?: string;
};

const Text = styled.span<TextProps>`
  color: ${({ theme, color }) => {
    if (typeof color === 'string' && color.includes('.')) {
      return get(theme.colors, color) || color;
    }
  }};
  font-weight: ${({ theme, weight = 'medium' }) => theme.fontWeight[weight]};
  ${({ theme, size = 'base' }) => theme.typeScale[size]};
`;

export default Text;
