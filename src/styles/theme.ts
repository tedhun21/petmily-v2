export type Theme = {
  typeScale: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
  };
  fontWeight: {
    light: number;
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
  };

  radius: {
    circle: string;
    base: string;
    md: string;
    lg: string;
  };

  colors: {
    text: {
      white: string;
      active: string;
      inactive: string;
      highlight: string;
      secondary: string;
      opposite: string;
      error: string;
    };
    line: {
      input: { primary: string; hover: string; highlight: string; error: string };
      box: { primary: string; hover: string; highlight: string };
      divider: { primary: string; highlight: string };
    };
    background: {
      primary: string;
      secondary: string;
      highlight: string;
      deepHighlight: string;
      darkHighlight: string;
      error: string;
      box: {
        default: { primary: string; hover: string; active: string; opposite: string };
        blue: { primary: string; hover: string; active: string; disabled: string };
      };
      input: { primary: string; hover: string };
    };
  };

  shadow: {
    onlyBottom: string;
    dp01: string;
    dp02: string;
    dp03: string;
    dp04: string;
    inset: string;
  };
};

const baseTheme = {
  typeScale: {
    xs: 'font-size: 0.75rem; line-height: 1rem;', // 12px, 16px
    sm: 'font-size: 0.875rem; line-height: 1.25rem;', // 14px, 20px
    base: 'font-size: 1rem; line-height: 1.5rem;', // 16px, 24px
    lg: 'font-size: 1.125rem; line-height: 1.75rem;', // 18px, 28px
    xl: 'font-size: 1.25rem; line-height: 1.75rem;', // 20px, 28px
    '2xl': 'font-size: 1.5rem; line-height: 2rem;', // 24px, 32px
  },

  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  radius: {
    circle: '50%',
    base: '0.75rem',
    md: '1rem',
    lg: '1.25rem',
  },
};

const lightTheme: Theme = {
  ...baseTheme,
  colors: {
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
      error: '#FF6161',
      box: {
        default: { primary: '#F2F2F2', hover: '#E8E8E8', active: '#D6D6D6', opposite: '#2C2C2C' },
        blue: { primary: '#279EFF', hover: '#1D8CE7', active: '#096DBE', disabled: '#757575' },
      },
      input: { primary: '#F7F7F7', hover: '#E8E8E8' },
    },
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

const darkTheme: Theme = {
  ...baseTheme,

  colors: {
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
      error: '#FF5A5A',
      box: {
        default: { primary: '#2C2C2C', hover: '#3B3B3B', active: '#404040', opposite: '#F2F2F2' },
        blue: { primary: '#1A73E8', hover: '#1451A5', active: '#0D3B73', disabled: '#787878' },
      },
      input: { primary: '#232323', hover: '#383838' },
    },
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
