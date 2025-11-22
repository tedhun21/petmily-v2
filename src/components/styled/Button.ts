import { css } from '@emotion/react';
import styled from '@emotion/styled';

const styleProps = ['size', 'variant', 'borderRadius', 'fullWidth'];

export type ButtonProps = {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  variant?: 'primary' | 'secondary' | 'transparent' | 'icon';
  borderRadius?: 'sm' | 'md' | 'lg' | 'circle';
  fullWidth?: boolean;
} & { as?: React.ElementType };

export const Button = styled('button', {
  shouldForwardProp: (prop) => !styleProps.includes(prop) && prop[0] !== '$',
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
  ${({ theme, size = 'md' }) => css`
    ${{
      sm: css`
        padding: ${theme.spacing.xs} ${theme.spacing.sm};
        ${theme.typeScale.sm};
      `,
      md: css`
        padding: ${theme.spacing.sm} ${theme.spacing.md};
        ${theme.typeScale.base};
      `,
      lg: css`
        padding: ${theme.spacing.md} ${theme.spacing.lg};
        ${theme.typeScale.lg};
      `,
      xl: css`
        padding: ${theme.spacing.lg} ${theme.spacing.xl};
        ${theme.typeScale.xl};
      `,
      ['2xl']: css`
        padding: ${theme.spacing.xl} ${theme.spacing['2xl']};
        ${theme.typeScale['2xl']};
      `,
    }[size]}
  `};

  ${({ theme, variant = 'primary' }) => css`
    ${{
      primary: css`
        background-color: ${theme.colors.background.box.accent.primary};
        color: ${theme.colors.text.white};
        border: none;

        &:hover:not(:disabled) {
          background-color: ${theme.colors.background.box.accent.hover};
        }
        &:active:not(:disabled) {
          background-color: ${theme.colors.background.box.accent.active};
          box-shadow: ${theme.shadow.inset};
        }
        &:disabled {
          background-color: ${theme.colors.background.box.accent.disabled};
        }
      `,
      secondary: css`
        background-color: ${theme.colors.background.box.default.primary};
        color: ${theme.colors.text.active};
        border: 1px solid ${theme.colors.line.box.primary};

        &:hover:not(:disabled) {
          background-color: ${theme.colors.background.box.default.hover};
        }
        &:active:not(:disabled) {
          background-color: ${theme.colors.background.box.default.active};
          box-shadow: ${theme.shadow.inset};
        }
        &:disabled {
          color: ${theme.colors.text.inactive};
          border-color: ${theme.colors.line.input.primary};
          background-color: ${theme.colors.background.box.default.primary};
        }
      `,
      transparent: css`
        background-color: transparent;

        &:hover:not(:disabled) {
          background-color: ${theme.colors.background.box.default.hover};
        }

        &:active:not(:disabled) {
          background-color: ${theme.colors.background.box.default.active};
          box-shadow: ${theme.shadow.inset};
        }
      `,
      icon: css`
        border: none;
        background-color: transparent;
        color: ${theme.colors.text.active};
        padding: ${theme.spacing.sm};

        &:hover:not(:disabled) {
          background-color: ${theme.colors.background.box.default.hover};
        }
        &:active:not(:disabled) {
          background-color: ${theme.colors.background.box.default.active};
        }
      `,
    }[variant]}
  `};

  ${({ fullWidth }) =>
    fullWidth &&
    css`
      width: 100%;
    `};
`;
