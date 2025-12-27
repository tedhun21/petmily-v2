import { css } from '@emotion/react';
import type { Theme } from './theme';

export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type ButtonVariant = 'primary' | 'secondary' | 'transparent' | 'error';

export const buttonStyles = {
  size: (theme: Theme, size: ButtonSize) => {
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
      case 'xl':
        return css`
          padding: ${theme.space.lg} ${theme.space.xl};
          ${theme.typeScale.xl};
        `;
      case '2xl':
        return css`
          padding: ${theme.space.xl} ${theme.space['2xl']};
          ${theme.typeScale['2xl']};
        `;
    }
  },
  variant: (theme: Theme, variant: ButtonVariant) => {
    switch (variant) {
      case 'primary':
        return css`
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
        `;
      case 'secondary':
        return css`
          background-color: ${theme.colors.background.box.default.primary};
          color: ${theme.colors.text.primary};
          border: 1px solid ${theme.colors.line.box.primary};

          &:hover:not(:disabled) {
            background-color: ${theme.colors.background.box.default.hover};
          }
          &:active:not(:disabled) {
            background-color: ${theme.colors.background.box.default.active};
            box-shadow: ${theme.shadow.inset};
          }
          &:disabled {
            opacity: 0.5;
          }
        `;
      case 'transparent':
        return css`
          background-color: transparent;

          &:hover:not(:disabled) {
            background-color: ${theme.colors.background.box.default.hover};
          }

          &:active:not(:disabled) {
            background-color: ${theme.colors.background.box.default.active};
            box-shadow: ${theme.shadow.inset};
          }
          &:disabled {
            opacity: 0.5;
          }
        `;
      case 'error':
        return css`
          background-color: ${theme.colors.background.box.error.primary};

          &:hover:not(:disabled) {
            background-color: ${theme.colors.background.box.error.hover};
          }

          &:hover:not(:disabled) {
            background-color: ${theme.colors.background.box.error.active};
          }
          &:disabled {
            opacity: 0.5;
          }
        `;
    }
  },
};

export type LinkSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type LinkVariant = 'button' | 'text' | 'image';

export const linkStyles = {
  size: (theme: Theme, size: ButtonSize) => {
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
      case 'xl':
        return css`
          padding: ${theme.space.lg} ${theme.space.xl};
          ${theme.typeScale.xl};
        `;
      case '2xl':
        return css`
          padding: ${theme.space.xl} ${theme.space['2xl']};
          ${theme.typeScale['2xl']};
        `;
    }
  },
  variant: (theme: Theme, variant: LinkVariant, buttonVariant: ButtonVariant) => {
    switch (variant) {
      case 'button':
        return buttonStyles.variant(theme, buttonVariant);

      case 'image':
        return css``;
      case 'text':
        return css`
          &:hover {
            color: ${theme.colors.text.accent.hover};
          }
          &:active {
            ${theme.colors.text.accent.active};
          }
        `;
    }
  },
};
