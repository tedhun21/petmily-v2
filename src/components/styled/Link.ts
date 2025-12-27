import { Link as RouteLink } from 'react-router-dom';
import styled from '@emotion/styled';
import { linkStyles, type ButtonVariant, type LinkSize, type LinkVariant } from '@/styles/helpers';

const styleProps = ['variant', 'btnVariant', 'size', 'borderRadius', 'fullWidth'];

type StyleLinkProps = {
  variant?: LinkVariant;
  btnVariant?: ButtonVariant;
  size?: LinkSize;
  borderRadius?: 'sm' | 'md' | 'lg' | 'circle';
  fullWidth?: boolean;
};

const Link = styled(RouteLink, {
  shouldForwardProp: (prop) => !styleProps.includes(prop) && !prop.startsWith('$'),
})<StyleLinkProps>`
  display: flex;
  justify-content: center;
  align-items: center;

  font-weight: 500;

  transition:
    background-color 0.2s ease-in-out,
    color 0.2s ease-in-out;

  border-radius: ${({ theme, borderRadius = 'md' }) => theme.radius[borderRadius]};
  ${({ theme, size = 'md' }) => linkStyles.size(theme, size)};

  ${({ theme, variant = 'text', btnVariant = 'transparent' }) => linkStyles.variant(theme, variant, btnVariant)};
`;

export default Link;
