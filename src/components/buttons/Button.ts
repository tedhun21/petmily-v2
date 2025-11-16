import styled, { css } from 'styled-components';

const styleProps = ['size', 'variant', 'borderRadius', 'fullWidth'];

export type ButtonProps = {
  children?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  variant?: 'primary' | 'secondary' | 'transparent' | 'icon';
  borderRadius?: 'sm' | 'md' | 'lg' | 'circle';
  fullWidth?: boolean;
};

const sizes = {
  sm: css`
    padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
    ${({ theme }) => theme.typeScale.sm};
  `,
  md: css`
    padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
    ${({ theme }) => theme.typeScale.base};
  `,
  lg: css`
    padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg}`};
    ${({ theme }) => theme.typeScale.lg};
  `,
  xl: css`
    padding: ${({ theme }) => `${theme.spacing.lg} ${theme.spacing.xl}`};
    ${({ theme }) => theme.typeScale.xl};
  `,
  ['2xl']: css`
    padding: ${({ theme }) => `${theme.spacing.xl} ${theme.spacing['2xl']}`};
    ${({ theme }) => theme.typeScale['2xl']}
  `,
};

const variants = {
  // Primary: 파란색 버튼
  primary: css`
    background-color: ${({ theme }) => theme.colors.background.box.accent.primary};
    color: ${({ theme }) => theme.colors.text.white};
    border: none;

    &:hover:not(:disabled) {
      background-color: ${({ theme }) => theme.colors.background.box.accent.hover};
    }
    &:active:not(:disabled) {
      background-color: ${({ theme }) => theme.colors.background.box.accent.active};
      box-shadow: ${({ theme }) => theme.shadow.inset};
    }
    &:disabled {
      background-color: ${({ theme }) => theme.colors.background.box.accent.disabled};
    }
  `,
  // Secondary: 회색 버튼
  secondary: css`
    background-color: ${({ theme }) => theme.colors.background.box.default.primary};
    color: ${({ theme }) => theme.colors.text.active};
    border: 1px solid ${({ theme }) => theme.colors.line.box.primary};

    &:hover:not(:disabled) {
      background-color: ${({ theme }) => theme.colors.background.box.default.hover};
    }
    &:active:not(:disabled) {
      background-color: ${({ theme }) => theme.colors.background.box.default.active};
      box-shadow: ${({ theme }) => theme.shadow.inset};
    }
    &:disabled {
      color: ${({ theme }) => theme.colors.text.inactive};
      border-color: ${({ theme }) => theme.colors.line.input.primary};
      background-color: ${({ theme }) => theme.colors.background.box.default.primary};
    }
  `,
  transparent: css`
    background-color: transparent;

    &:hover:not(:disabled) {
      background-color: ${({ theme }) => theme.colors.background.box.default.hover};
    }

    &:active:not(:disabled) {
      background-color: ${({ theme }) => theme.colors.background.box.default.active};
      box-shadow: ${({ theme }) => theme.shadow.inset};
    }
  `,
  icon: css`
    border: none;
    background-color: transparent;
    color: ${({ theme }) => theme.colors.text.active};
    padding: ${({ theme }) => theme.spacing.sm};

    &:hover:not(:disabled) {
      background-color: ${({ theme }) => theme.colors.background.box.default.hover};
    }
    &:active:not(:disabled) {
      background-color: ${({ theme }) => theme.colors.background.box.default.active};
    }
  `,
};

export const Button = styled.button.withConfig({
  shouldForwardProp: (prop) => !styleProps.includes(prop),
})<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:disabled {
    pointer-events: none;
  }

  border-radius: ${({ theme, borderRadius = 'md' }) => theme.radius[borderRadius]};
  ${({ size = 'md' }) => sizes[size]};
  ${({ variant = 'primary' }) => variants[variant]};
  ${({ fullWidth }) =>
    fullWidth &&
    css`
      width: 100%;
    `};
`;
