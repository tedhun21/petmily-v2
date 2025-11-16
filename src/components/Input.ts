import styled, { css } from 'styled-components';

const styleProps = ['size', 'variant', 'error', 'fullWidth', 'borderRadius'];

// Input props 타입을 정의합니다.
export type InputProps = {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'search';
  error?: boolean;
  fullWidth?: boolean;
  borderRadius?: 'sm' | 'md' | 'lg' | 'circle';
};

const sizes = {
  sm: css`
    padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
    ${({ theme }) => theme.typeScale.sm};
  `,
  md: css`
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
    ${({ theme }) => theme.typeScale.base};
  `,
  lg: css`
    padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
    ${({ theme }) => theme.typeScale.lg};
  `,
};

const variants = {
  default: css<InputProps>`
    border: 1px solid ${({ theme }) => theme.colors.line.input.primary};

    &:focus {
      border-color: ${({ theme }) => theme.colors.line.input.focus};
    }

    ${({ error, theme }) =>
      error &&
      css`
        border-color: ${theme.colors.line.input.error};
      `}
  `,
  search: css`
    border: 1px solid ${({ theme }) => theme.colors.line.input.primary};
  `,
};

export const Input = styled.input.withConfig({
  shouldForwardProp: (prop) => !styleProps.includes(prop),
})<InputProps>`
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
  ${({ size = 'md' }) => sizes[size]};
  ${({ variant = 'default' }) => variants[variant]};
  ${({ fullWidth }) =>
    fullWidth &&
    css`
      width: 100%;
    `};
`;
