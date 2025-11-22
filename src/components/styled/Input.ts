import { css } from '@emotion/react';
import type { Theme } from '@emotion/react';
import styled from '@emotion/styled';

const styleProps = ['size', 'variant', 'error', 'fullWidth', 'borderRadius'];

const shouldForwardProp = (propName: string) => !styleProps.includes(propName);

type Size = 'sm' | 'md' | 'lg';
type Variant = 'default' | 'search';
type BorderRadius = 'sm' | 'md' | 'lg' | 'circle';

export type InputProps = {
  inputSize?: Size;
  variant?: Variant;
  error?: boolean;
  fullWidth?: boolean;
  borderRadius?: BorderRadius;
} & React.ComponentProps<'input'>;

// ===== Helper functions =====
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

const getVariantStyles = (theme: Theme, variant: Variant, error?: boolean) => {
  switch (variant) {
    case 'default':
      return css`
        border: 1px solid ${theme.colors.line.input.primary};
        &:focus {
          border-color: ${theme.colors.line.input.focus};
        }
        ${error && `border-color: ${theme.colors.line.input.error}`};
      `;
    case 'search':
      return css`
        border: 1px solid ${theme.colors.line.input.primary};
      `;
  }
};

// ===== Styled Component =====
export const Input = styled('input')<InputProps>`
  font-weight: 500;
  transition: all 0.2s ease-in-out;
  outline: none;
  color: ${({ theme }) => theme.colors.text.active};
  background-color: ${({ theme }) => theme.colors.background.input.primary};

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.inactive};
  }

  &:disabled {
    cursor: not-allowed;
    background-color: ${({ theme }) => theme.colors.background.input.disabled};
    color: ${({ theme }) => theme.colors.text.inactive};
  }

  border-radius: ${({ theme, borderRadius = 'md' }) => theme.radius[borderRadius]};

  ${({ theme, inputSize = 'md' }) => getSizeStyles(theme, inputSize)};
  ${({ theme, variant = 'default', error }) => getVariantStyles(theme, variant, error)};

  ${({ fullWidth }) =>
    fullWidth &&
    css`
      width: 100%;
    `};
`;
