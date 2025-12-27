import { css } from '@emotion/react';
import styled from '@emotion/styled';
import type { Theme } from '@/styles/theme';
import { Link } from 'react-router-dom';

type Size = 'sm' | 'md' | 'lg' | 'xl';
type Variant = 'fill' | 'clear' | 'border';

type StyleProps = {
  variant?: Variant;
  bgColor?: string;
  size?: Size;
  shape?: 'circle' | 'rounded';
};

const variantStyles = (theme: Theme, variant: StyleProps['variant'] = 'fill', bgColor?: string) => {
  const baseBg = bgColor || theme.colors.background.box.default.primary;
  const dark = theme.name === 'dark';

  switch (variant) {
    case 'fill':
      return css`
        background-color: ${baseBg};
        border: none;

        &:hover {
          filter: ${dark ? 'brightness(1.15)' : 'brightness(0.95)'};
        }

        &:active {
          filter: ${dark ? 'brightness(1.1)' : 'brightness(0.9)'};
        }
      `;
    case 'border':
      return css`
        background-color: transparent;
        border: 1px solid ${theme.colors.line.box.primary};

        &:hover {
          filter: ${dark ? 'brightness(1.15)' : 'brightness(0.95)'};
        }

        &:active {
          filter: ${dark ? 'brightness(1.1)' : 'brightness(0.9)'};
        }
      `;

    case 'clear':
      return css`
        background-color: ${theme.colors.background.layer0};
        border: none;

        &:hover {
          filter: ${dark ? 'brightness(1.15)' : 'brightness(0.95)'};
        }

        &:active {
          filter: ${dark ? 'brightness(1.1)' : 'brightness(0.9)'};
        }
      `;
  }
};

const sizeStyles = (theme: Theme, size: Size) => {
  switch (size) {
    case 'sm':
      return css`
        padding: ${theme.space.sm};
        ${theme.typeScale.sm};
      `;
    case 'md':
      return css`
        padding: ${theme.space.md};
        ${theme.typeScale.base};
      `;
    case 'lg':
      return css`
        padding: ${theme.space.lg};
        ${theme.typeScale.lg};
      `;
    case 'xl':
      return css`
        padding: ${theme.space.xl};
        ${theme.typeScale.xl};
      `;
  }
};

const BaseIconElement = styled.div<StyleProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  border-radius: ${({ shape = 'circle' }) => (shape === 'rounded' ? '12px' : '50%')};
  transition: all 0.2s ease-in-out;

  &:active {
    transform: scale(0.95);
  }

  &:disabled,
  &[aria-disabled='true'] {
    opacity: 0.5;
    cursor: not-allowed;
    &:active {
      transform: none;
    }
  }

  ${({ theme, variant = 'clear', bgColor }) => variantStyles(theme, variant, bgColor)};
  ${({ theme, size = 'md' }) => sizeStyles(theme, size)};
`;

const IconButton = styled(BaseIconElement.withComponent('button'))<StyleProps>`
  color: inherit;
  border: none;
`;

const IconLink = styled(BaseIconElement.withComponent(Link))<StyleProps>`
  text-decoration: none;
  cursor: pointer;
`;

export { IconButton, IconLink };
