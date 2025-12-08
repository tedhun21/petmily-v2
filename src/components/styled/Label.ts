import styled from '@emotion/styled';
import type { Theme } from '@/styles/theme';
import { css } from '@emotion/react';
import { colors } from '@/styles/colors';

type Color = 'blue' | 'grey' | 'green' | 'red' | 'yellow';
type Size = 'sm' | 'md' | 'lg';
type BorderRadius = 'sm' | 'md' | 'lg' | 'circle';

interface LabelProps {
  color?: Color;
  size?: Size;
  borderRadius?: BorderRadius;
}

const getColor = (theme: Theme, color: Color) => {
  switch (color) {
    case 'blue':
      return css`
        ${theme.colors.background.highlight};
      `;
    case 'grey':
      return css`
        ${colors.grey800};
      `;
  }
};

const getSizeStyles = (theme: Theme, size: Size) => {
  switch (size) {
    case 'sm':
      return css`
        padding: ${theme.space.xs} ${theme.space.sm};
        ${theme.typeScale.sm};
      `;
    case 'md':
      return css`
        padding: ${theme.space.sm} ${theme.space.md};
        ${theme.typeScale.base};
      `;
    case 'lg':
      return css`
        padding: ${theme.space.md} ${theme.space.lg};
        ${theme.typeScale.lg};
      `;
  }
};

export const Label = styled.label<LabelProps>`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  color: ${({ theme }) => theme.colors.text.white};
  background-color: ${({ theme, color = 'blue' }) => getColor(theme, color)};
  border-radius: ${({ theme, borderRadius = 'md' }) => theme.radius[borderRadius]};

  ${({ theme, size = 'md' }) => getSizeStyles(theme, size)};
`;
