import { css } from '@emotion/react';
import emotionReset from 'emotion-reset';

export const globalStyles = css`
  ${emotionReset};

  * {
    box-sizing: border-box;
  }

  body {
    font-family: 'Noto Sans KR', Roboto, sans-serif;
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
