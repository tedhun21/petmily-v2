import { css, type Theme } from '@emotion/react';
import emotionReset from 'emotion-reset';

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
    color: inherit;
    cursor: pointer;
    padding: 0;
    background-color: transparent;
  }

  li {
    list-style-type: none;
  }

  input {
    outline: none;
    border: none;
    color: inherit;
    background-color: transparent;
  }
`;
