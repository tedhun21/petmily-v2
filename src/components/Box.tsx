import React from 'react';
import styled, { css } from 'styled-components';
import { Theme } from 'styles/theme';

const styleProps = [
  'bg',
  'w',
  'h',
  'p',
  'px',
  'py',
  'pl',
  'pr',
  'pt',
  'pb',
  'm',
  'mx',
  'my',
  'ml',
  'mr',
  'mt',
  'mb',
  'br',
  'shadow',
];

// ===== Helpers =====
const getSize = (value?: string | number) => {
  if (value === undefined) return undefined;
  return typeof value === 'number' ? `${value}px` : value;
};

const getSpacing = (theme: Theme, value?: keyof Theme['spacing'] | number) => {
  if (value === undefined) return undefined;
  return typeof value === 'number' ? `${value}px` : theme.spacing[value];
};

const getRadius = (theme: Theme, value?: keyof Theme['radius'] | number) => {
  if (value === undefined) return undefined;
  return typeof value === 'number' ? `${value}px` : theme.radius[value];
};

const getColor = (theme: Theme, value?: string) => {
  if (!value) return undefined;
  const properties = value.split('.');
  const color = properties.reduce(
    (acc: any, curr) => (acc && acc[curr] !== undefined ? acc[curr] : undefined),
    theme.colors,
  );
  return color || value;
};

// ===== Types =====
type SpacingValue = keyof Theme['spacing'] | number;
type RadiusValue = keyof Theme['radius'] | number;

interface BoxProps {
  children?: React.ReactNode;
  bg?: string;
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
}

// ===== Styled Component =====
const BoxStyle = styled.div.withConfig({
  shouldForwardProp: (prop) => !styleProps.includes(prop),
})<BoxProps>`
  width: ${({ w }) => getSize(w)};
  height: ${({ h }) => getSize(h)};
  background-color: ${({ theme, bg }) => getColor(theme, bg)};
  border-radius: ${({ theme, br }) => getRadius(theme, br)};
  box-shadow: ${({ theme, shadow }) => (shadow ? theme.shadow[shadow] : undefined)};

  ${({ theme, p, px, py, pl, pr, pt, pb }) => css`
    ${p && `padding: ${getSpacing(theme, p)};`}
    ${px && `padding-left: ${getSpacing(theme, px)}; padding-right: ${getSpacing(theme, px)};`}
    ${py && `padding-top: ${getSpacing(theme, py)}; padding-bottom: ${getSpacing(theme, py)};`}
    ${pl && `padding-left: ${getSpacing(theme, pl)};`}
    ${pr && `padding-right: ${getSpacing(theme, pr)};`}
    ${pt && `padding-top: ${getSpacing(theme, pt)};`}
    ${pb && `padding-bottom: ${getSpacing(theme, pb)};`}
  `}

  ${({ theme, m, mx, my, ml, mr, mt, mb }) => css`
    ${m && `margin: ${getSpacing(theme, m)};`}
    ${mx && `margin-left: ${getSpacing(theme, mx)}; margin-right: ${getSpacing(theme, mx)};`}
    ${my && `margin-top: ${getSpacing(theme, my)}; margin-bottom: ${getSpacing(theme, my)};`}
    ${ml && `margin-left: ${getSpacing(theme, ml)};`}
    ${mr && `margin-right: ${getSpacing(theme, mr)};`}
    ${mt && `margin-top: ${getSpacing(theme, mt)};`}
    ${mb && `margin-bottom: ${getSpacing(theme, mb)};`}
  `}
`;

// ===== React Component =====
type BoxContainerProps = React.HTMLAttributes<HTMLDivElement> & BoxProps & { as?: React.ElementType };

export default function Box({ children, ...rest }: BoxContainerProps) {
  return <BoxStyle {...rest}>{children}</BoxStyle>;
}
