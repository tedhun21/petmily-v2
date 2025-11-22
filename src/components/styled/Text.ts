import styled from '@emotion/styled';
import { Theme } from '@/styles/theme';

type TextProps = {
  size?: keyof Theme['typeScale'];
  weight?: keyof Theme['fontWeight'];
  color?: keyof Theme['colors']['text'];
};

export const Text = styled.span<TextProps>`
  color: ${({ theme, color = 'active' }) => theme.colors.text[color]};
  font-weight: ${({ theme, weight = 'medium' }) => theme.fontWeight[weight]};
  ${({ theme, size = 'base' }) => theme.typeScale[size]};
`;
