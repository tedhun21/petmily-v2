import { Link as RouteLink } from 'react-router-dom';
import styled, { css } from 'styled-components';

const sizes = {
  sm: css`
    ${({ theme }) => theme.typeScale.sm};
  `,
  md: css`
    ${({ theme }) => theme.typeScale.base};
  `,
  lg: css`
    ${({ theme }) => theme.typeScale.lg};
  `,
  xl: css`
    ${({ theme }) => theme.typeScale.xl};
  `,
};

type LinkProps = {
  children: React.ReactNode;
  to: string;
  type: 'image' | 'text' | 'icon';
  size?: 'sm' | 'md' | 'lg' | 'xl';
};

export default function Link({ children, to, type, size = 'md', ...rest }: LinkProps) {
  return (
    <LinkWrapper to={to} {...rest}>
      {type === 'image' ? <>{children}</> : type === 'text' ? <Text size={size}>{children}</Text> : null}
    </LinkWrapper>
  );
}

const LinkWrapper = styled(RouteLink)`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Text = styled.span<{ size: 'sm' | 'md' | 'lg' | 'xl' }>`
  ${({ size }) => sizes[size]};

  transition: color 0.3s;
  &:hover:not(disabled) {
    color: ${({ theme }) => theme.colors.text.highlight};
  }
`;
