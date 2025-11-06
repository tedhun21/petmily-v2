import styled from 'styled-components';
import { Theme } from 'styles/theme';

type TextProps = {
  $size?: keyof Theme['typeScale'];
  $weight?: keyof Theme['fontWeight'];
  $color?: keyof Theme['colors']['text'];
};

export const Text = styled.span<TextProps>`
  color: ${({ theme, $color = 'active' }) => theme.colors.text[$color]};
  font-weight: ${({ theme, $weight = 'normal' }) => theme.fontWeight[$weight]};
  ${({ theme, $size = 'base' }) => theme.typeScale[$size]};
`;
