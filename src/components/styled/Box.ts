import { css } from '@emotion/react';
import styled from '@emotion/styled';
import type { Theme } from '@/styles/theme';

const get = (obj: any, path: string) => path.split('.').reduce((acc, key) => acc && acc[key], obj);

const getSize = (value?: string | number) => {
  if (value === undefined) return undefined;
  return typeof value === 'number' ? `${value}px` : value;
};

const getSpace = (theme: Theme, value?: keyof Theme['space'] | number) => {
  if (value === undefined) return undefined;
  return typeof value === 'number' ? `${value}px` : theme.space[value];
};

const getRadius = (theme: Theme, value?: keyof Theme['radius'] | number) => {
  if (value === undefined) return undefined;
  return typeof value === 'number' ? `${value}px` : theme.radius[value];
};

type SpacingValue = keyof Theme['space'] | number;
type RadiusValue = keyof Theme['radius'] | number;

type BoxProps = {
  bgColor?: string;
  w?: string;
  h?: string;
  p?: SpacingValue;
  px?: SpacingValue;
  py?: SpacingValue;
  pl?: SpacingValue;
  pr?: SpacingValue;
  pt?: SpacingValue;
  pb?: SpacingValue;
  m?: SpacingValue;
  mx?: SpacingValue;
  my?: SpacingValue;
  ml?: SpacingValue;
  mr?: SpacingValue;
  mt?: SpacingValue;
  mb?: SpacingValue;
  br?: RadiusValue;
  shadow?: keyof Theme['shadow'];
} & { as?: React.ElementType };

const Box = styled.div<BoxProps>`
  width: ${({ w }) => getSize(w)};
  height: ${({ h }) => getSize(h)};
  background-color: ${({ theme, bgColor }) => {
    if (typeof bgColor === 'string' && bgColor.includes('.')) {
      return get(theme.colors, bgColor) || bgColor;
    }
    return bgColor;
  }};
  border-radius: ${({ theme, br }) => getRadius(theme, br)};
  box-shadow: ${({ theme, shadow }) => (shadow ? theme.shadow[shadow] : undefined)};

  ${({ theme, p, px, py, pl, pr, pt, pb }) => css`
    ${p && `padding: ${getSpace(theme, p)};`}
    ${px && `padding-left: ${getSpace(theme, px)}; padding-right: ${getSpace(theme, px)};`}
    ${py && `padding-top: ${getSpace(theme, py)}; padding-bottom: ${getSpace(theme, py)};`}
    ${pl && `padding-left: ${getSpace(theme, pl)};`}
    ${pr && `padding-right: ${getSpace(theme, pr)};`}
    ${pt && `padding-top: ${getSpace(theme, pt)};`}
    ${pb && `padding-bottom: ${getSpace(theme, pb)};`}
  `}

  ${({ theme, m, mx, my, ml, mr, mt, mb }) => css`
    ${m && `margin: ${getSpace(theme, m)};`}
    ${mx && `margin-left: ${getSpace(theme, mx)}; margin-right: ${getSpace(theme, mx)};`}
    ${my && `margin-top: ${getSpace(theme, my)}; margin-bottom: ${getSpace(theme, my)};`}
    ${ml && `margin-left: ${getSpace(theme, ml)};`}
    ${mr && `margin-right: ${getSpace(theme, mr)};`}
    ${mt && `margin-top: ${getSpace(theme, mt)};`}
    ${mb && `margin-bottom: ${getSpace(theme, mb)};`}
  `}
`;

export default Box;
