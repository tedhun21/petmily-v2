import styled from '@emotion/styled';
import { Theme } from '@/styles/theme';
import { css } from '@emotion/react';

type Size = 'sm' | 'md' | 'lg';
type BorderRadius = 'sm' | 'md' | 'lg' | 'circle';

interface LabelProps {
  color?: 'blue' | 'green' | 'red' | 'yellow';
  size?: Size;
  borderRadius?: BorderRadius;
}

const getSizeStyles = (theme: Theme, size: Size) => {
  switch (size) {
    case 'sm':
      return css`
        padding: ${theme.spacing.xs} ${theme.spacing.sm};
        ${theme.typeScale.sm};
      `;
    case 'md':
      return css`
        padding: ${theme.spacing.sm} ${theme.spacing.md};
        ${theme.typeScale.base};
      `;
    case 'lg':
      return css`
        padding: ${theme.spacing.md} ${theme.spacing.lg};
        ${theme.typeScale.lg};
      `;
  }
};

export const Label = styled.label<LabelProps>`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  color: ${({ theme }) => theme.colors.text.white};
  background-color: ${({ theme }) => theme.colors.background.highlight};
  border-radius: ${({ theme, borderRadius = 'md' }) => theme.radius[borderRadius]};

  ${({ theme, size = 'md' }) => getSizeStyles(theme, size)};
`;
