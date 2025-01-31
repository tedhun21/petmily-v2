const baseTheme = {
  fontSize: {
    s12h18: 'font-size: 12px; line-height: 18px;',
    s14h21: 'font-size: 14px; line-height: 21px;',
    s16h24: 'font-size: 16px; line-height: 24px;',
    s18h27: 'font-size: 18px; line-height: 27px;',
    s20h30: 'font-size: 20px; line-height: 30px;',
  },

  fontWeight: {
    light: 400,
    normal: 500,
    bold: 600,
    extrabold: 700,
  },

  radius: {
    circle: '50%',
    normal: '12px',
    large: '20px',
  },
};

const lightTheme = {
  ...baseTheme,

  text: {
    white: '#FFFFF0',
    active: '#1A1A1A',
    inactive: '#999999',
    highlight: '#279EFF',
    secondary: '#B5B5B5',
    opposite: '#EAEAEA',
    error: '#FF6161',
  },
  line: {
    input: { primary: '#D4D4D4', hover: '#808080', highlight: '#279EFF', error: '#FF6161' },
    box: { primary: '#CDCDCD', hover: '#525252', highlight: '#279EFF' },
    divider: { primary: '#DEEDE0', highlight: '#1A73E8' },
  },
  background: {
    primary: '#FFFFFF',
    secondary: '#F5F6F8',
    highlight: '#279EFF',
    deepHighlight: '#1D8CE7',
    darkHighlight: '#096DBE',
    red: '#FF6161',
    box: {
      default: { primary: '#F2F2F2', hover: '#E8E8E8', active: '#D6D6D6', opposite: '#2C2C2C' },
      blue: { primary: '#279EFF', hover: '#1D8CE7', active: '#096DBE', disabled: '#757575' },
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

  text: {
    white: '#FFFFF0',
    active: '#EAEAEA',
    inactive: '#6B6B6B',
    highlight: '#1A73E8',
    secondary: '#A6A6A6',
    opposite: '#1A1A1A',
    error: '#FF5A5A',
  },

  line: {
    input: { primary: '#474747', hover: '#636363', highlight: '#1A73E8', error: '#FF5A5A' },
    box: { primary: '#525252', hover: '#CDCDCD', highlight: '#1A73E8' },
    divider: { primary: '#525252', highlight: '#1A73E8' },
  },

  background: {
    primary: '#1C1C1C',
    secondary: '#121212',
    highlight: '#1A73E8',
    deepHighlight: '#1451A5',
    darkHighlight: '#0D3B73',
    red: '#FF5A5A',
    box: {
      default: { primary: '#2C2C2C', hover: '#3B3B3B', active: '#404040', opposite: '#F2F2F2' },
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
