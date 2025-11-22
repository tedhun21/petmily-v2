import styled from '@emotion/styled';
import { Theme } from '@/styles/theme';

const styleProps = ['direction', 'justifyContent', 'alignItems', 'gap'];

export type FlexProps = {
  direction?: 'row' | 'column';
  justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
  gap?: number | keyof Theme['spacing'];
} & { as?: React.ElementType };

const getGap = (gap?: number | keyof Theme['spacing'], theme?: Theme) => {
  if (typeof gap === 'number') return `${gap}px`;
  if (theme && gap) return theme.spacing[gap];
  return undefined;
};

const Flex = styled('div', { shouldForwardProp: (prop) => !styleProps.includes(prop) })<FlexProps>`
  display: flex;
  flex-direction: ${({ direction }) => direction};
  justify-content: ${({ justifyContent }) => justifyContent};
  align-items: ${({ alignItems }) => alignItems};
  gap: ${({ gap, theme }) => getGap(gap, theme)};
`;

export default Flex;
