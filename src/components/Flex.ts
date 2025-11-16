// src/styles/mixins/flex.ts

import styled, { css } from 'styled-components';
import { Theme } from 'styles/theme';

// Mixin의 인수를 위한 타입 정의
export type FlexMixinProps = {
  direction?: 'row' | 'column';
  justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
  gap?: number | keyof Theme['spacing'];
};

export const flex = ({ direction, justifyContent, alignItems, gap }: FlexMixinProps = {}) => css`
  display: flex;
  flex-direction: ${direction};
  justify-content: ${justifyContent};
  align-items: ${alignItems};

  ${({ theme }) =>
    gap !== undefined
      ? css`
          gap: ${typeof gap === 'number' ? `${gap}px` : theme.spacing[gap]};
        `
      : ''}
`;

const styleProps = ['direction', 'justifyContent', 'alignItems', 'gap'];

export const Flex = styled.div.withConfig({ shouldForwardProp: (prop) => !styleProps.includes(prop) })<FlexMixinProps>`
  ${(props) => flex(props)}
`;
