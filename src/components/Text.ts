import styled from 'styled-components';
import { Theme } from 'styles/theme';

const styleProps = ['size', 'weight', 'color'];

type TextProps = {
  size?: keyof Theme['typeScale'];
  weight?: keyof Theme['fontWeight'];
  color?: keyof Theme['colors']['text'];
};

export const Text = styled.span.withConfig({
  shouldForwardProp: (prop) => !styleProps.includes(prop),
})<TextProps>`
  color: ${({ theme, color = 'active' }) => theme.colors.text[color]};
  font-weight: ${({ theme, weight = 'medium' }) => theme.fontWeight[weight]};
  ${({ theme, size = 'base' }) => theme.typeScale[size]};
`;
