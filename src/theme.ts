import { css } from 'styled-components';
// 1. 활성 텍스트
// 2. 비활성 텍스트
// 3. 강조 텍스트
// 4. 보조 텍스트
// 5. 에러 텍스트

const baseTheme = {
  fontSize: {
    s12h18: css`
      font-size: 12px;
      line-height: 18px;
    `,
    s14h21: css`
      font-size: 14px;
      line-height: 21px;
    `,
    s16h24: css`
      font-size: 16px;
      line-height: 24px;
    `,
    s18h27: css`
      font-size: 18px;
      line-height: 27px;
    `,
    s20h30: css`
      font-size: 20px;
      line-height: 30px;
    `,
  },
  fontWeight: {
    light: 400,
    normal: 500,
    bold: 600,
    extrabold: 700,
  },
};

const lightTheme = {
  ...baseTheme,
  // color: {
  //   black: '#0A0A0A',
  //   gray: '#F2F2F2',
  //   white: '#ffffff',
  //   mainBlue: '#279EFF',
  //   subBlue: '#1D8CE7',
  //   darkBlue: '#096DBE',
  //   skyBlue: '#78C1F3',
  //   paleBlue: '#9AC5F4',
  //   red: '#FF6161',
  // },
  text: {
    active: '#1A1A1A',
    inactive: '#525252',
    highlight: '#279EFF',
    secondary: '#B5B5B5',
    error: '#FF6161',
  },
  line: {
    input: { default: '#D4D4D4', blue: '#279EFF', error: '#FF6161' },
    box: { default: '#CDCDCD', highlight: '#525252', blue: '#279EFF' },
    divider: { default: '#DEE', blue: '#1A73E8' },
  },
  background: {
    primary: '#FFFFFF',
    secondary: '#F5F6F8',
    highlight: '#279EFF',
    deepHighlight: '#1D8CE7',
    darkHighlight: '#096DBE',
    box: {
      default: { primary: '#FFFEFE', hover: '#f6f6f6', active: '#C1C1C1' },
      blue: { primary: '#279EFF', hover: '#1D8CE7', active: '#096DBE', diasbled: '#757575' },
    },
    input: { primary: '#F7F7F7', hover: '#E8E8E8' },
  },
  shadow: {
    onlyBottom: '0px 4px 4px rgba(39,44, 86, 0.06)',
    dp01: '0px 10px 34px 0px rgba(39, 44, 86, 0.1)',
    dp02: '0px 4px 12px 0px rgba(39, 44, 86, 0.15)',
    dp03: '0px 12px 60px 0px rgba(39, 44, 86, 0.2)',
    dp04: '0px 35px 64px 0px rgba(39, 44, 86, 0.25)',
    inset: 'inset 0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
  },
};

const darkTheme = {
  ...baseTheme,
  // color: {
  //   black: '#121212',
  //   gray: '#2C2C2C',
  //   white: '#EAEAEA',
  //   mainBlue: '#1A73E8',
  //   subBlue: '#1451A5',
  //   darkBlue: '#0D3B73',
  //   skyBlue: '#6096D1',
  //   paleBlue: '#8BADE6',
  //   red: '#FF5A5A',
  // },

  text: {
    active: '#EAEAEA',
    inactive: '#A3A3A3',
    highlight: '#1A73E8',
    secondary: '#A6A6A6',
    error: '#FF5A5A',
  },

  line: {
    input: { default: '#1C1C1C', blue: '#1A73E8', error: '#FF5A5A' },
    box: { default: '#525252', highlight: '#CDCDCD', blue: '#1A73E8' },
    divider: { default: '#525252', blue: '#1A73E8' },
  },

  background: {
    primary: '#1C1C1C',
    secondary: '#121212',
    highlight: '#1A73E8',
    deepHighlight: '#1451A5',
    darkHighlight: '#0D3B73',
    box: {
      default: { primary: '#2C2C2C', hover: '#323232', active: '#383838' },
      blue: { primary: '#1A73E8', hover: '#1451A5', active: '#0D3B73', disabled: '#787878' },
    },
    input: { primary: '#232323', hover: '#383838' },
  },

  shadow: {
    onlyBottom: '0px 4px 4px rgba(0, 0, 0, 0.4)',
    dp01: '0px 10px 34px 0px rgba(0, 0, 0, 0.6)',
    dp02: '0px 4px 12px 0px rgba(0, 0, 0, 0.5)',
    dp03: '0px 12px 60px 0px rgba(0, 0, 0, 0.7)',
    dp04: '0px 35px 64px 0px rgba(0, 0, 0, 0.75)',
    inset: 'inset 0px 2px 6px rgba(255, 255, 255, 0.1)',
  },
};

export { lightTheme, darkTheme };
