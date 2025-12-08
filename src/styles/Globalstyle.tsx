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
    background-color: ${theme.colors.background.secondary};
    color: ${theme.colors.text.active};
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  li {
    list-style-type: none;
  }

  button {
    border: none;
    color: inherit;
    background: none;
  }

  input {
    outline: none;
    color: inherit;
  }
`;
