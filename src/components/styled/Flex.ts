import styled from '@emotion/styled';
import type { Theme } from '@/styles/theme';

const styleProps = ['direction', 'justifyContent', 'alignItems', 'gap', 'flexWrap'];

export type FlexProps = {
  direction?: 'row' | 'column';
  justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
  flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  gap?: number | keyof Theme['space'];
} & { as?: React.ElementType };

const getGap = (gap?: number | keyof Theme['space'], theme?: Theme) => {
  if (typeof gap === 'number') return `${gap}px`;
  if (theme && gap) return theme.space[gap];
  return undefined;
};

const Flex = styled('div', { shouldForwardProp: (prop) => !styleProps.includes(prop) })<FlexProps>`
  display: flex;
  flex-direction: ${({ direction }) => direction};
  justify-content: ${({ justifyContent }) => justifyContent};
  align-items: ${({ alignItems }) => alignItems};
  flex-wrap: ${({ flexWrap }) => flexWrap};
  gap: ${({ gap, theme }) => getGap(gap, theme)};
`;

export default Flex;
