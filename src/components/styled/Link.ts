import { Link as RouteLink } from 'react-router-dom';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import React from 'react';
import { Theme } from '@/styles/theme';

type LinkSize = 'sm' | 'md' | 'lg' | 'xl';

const styleProps = ['variant', 'size'];

interface LinkProps extends React.ComponentProps<typeof RouteLink> {
  variant?: 'text' | 'icon' | 'image';
  size?: LinkSize | number;
}

const getTextSizeStyles = (theme: Theme, size: LinkSize) => {
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
    case 'xl':
      return css`
        padding: ${theme.spacing.lg} ${theme.spacing['2xl']};
        ${theme.typeScale['2xl']};
      `;
    default:
      return css`
        padding: ${theme.spacing.sm} ${theme.spacing.md};
        ${theme.typeScale.base};
      `;
  }
};

export const Link = styled(RouteLink, {
  shouldForwardProp: (prop) => !styleProps.includes(prop) && prop[0] !== '$',
})<LinkProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition:
    background-color 0.2s ease-in-out,
    color 0.2s ease-in-out;

  ${({ theme, size }) => getTextSizeStyles(theme, size as LinkSize)};

  ${({ variant = 'text', theme }) => {
    switch (variant) {
      case 'icon': {
        return css`
          border-radius: ${theme.radius.circle};
          padding: ${theme.spacing.sm};
          color: ${theme.colors.text.active};

          &:hover:not(:disabled) {
            background-color: ${theme.colors.background.box.default.hover};
          }
          &:active:not(:disabled) {
            background-color: ${theme.colors.background.box.default.active};
          }
        `;
      }
      case 'image':
        return css``;
      case 'text':
        return css`
          &:hover:not(:disabled) {
            color: ${theme.colors.text.highlight};
          }
        `;
    }
  }}
`;

export default Link;
