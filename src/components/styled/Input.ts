import { css } from '@emotion/react';
import type { Theme } from '@emotion/react';
import styled from '@emotion/styled';

const styleProps = ['inputSize', 'variant', 'error', 'fullWidth', 'borderRadius'];

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

const getVariantStyles = (theme: Theme, variant: Variant, error?: boolean) => {
  switch (variant) {
    case 'default':
      return css`
        border: 1px solid ${theme.colors.line.input.primary};
        &:focus {
          border-color: ${theme.colors.line.input.focus};
        }
        ${error &&
        css`
          border-color: ${theme.colors.line.input.error};
          &:focus {
            border-color: ${theme.colors.line.input.error};
          }
        `}
      `;
    case 'search':
      return css`
        border: 1px solid ${theme.colors.line.input.primary};
      `;
  }
};

export const Input = styled('input', {
  shouldForwardProp: (prop) => !styleProps.includes(prop) && prop[0] !== '$',
})<InputProps>`
  font-weight: 500;
  transition: all 0.2s ease-in-out;
  outline: none;
  color: ${({ theme }) => theme.colors.text.primary};
  background-color: ${({ theme }) => theme.colors.background.input.primary};

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.secondary};
  }

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.background.input.hover};
  }

  &:focus:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.background.input.focus};
  }

  &:disabled {
    cursor: not-allowed;
    background-color: ${({ theme }) => theme.colors.background.input.disabled};
    color: ${({ theme }) => theme.colors.text.secondary};
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
