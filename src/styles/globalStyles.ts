import { css } from '@emotion/react';
import emotionReset from 'emotion-reset';
import type { Theme } from './theme';

export const globalStyles = (theme: Theme) => css`
  ${emotionReset};

  * {
    box-sizing: border-box;
  }

  body {
    font-family: 'Noto Sans KR', Roboto, sans-serif;
    background-color: ${theme.colors.background.layer1};
    color: ${theme.colors.text.primary};
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  button {
    border: none;
    cursor: pointer;
    color: inherit;
  }

  li {
    list-style-type: none;
  }

  input {
    outline: none;
    color: inherit;
  }
`;
