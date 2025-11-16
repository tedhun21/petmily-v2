// =======================
// Types
// =======================

export type Theme = {
  typeScale: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    ['2xl']: string;
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
    sm: string;
    md: string;
    lg: string;
  };

  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    ['2xl']: string;
    ['3xl']: string;
    ['4xl']: string;
    ['5xl']: string;
  };

  colors: {
    text: {
      white: string;
      active: string;
      inactive: string;
      highlight: string;
      secondary: string;
      inverse: string;
      error: string;
      black: string;
    };
    line: {
      input: {
        primary: string;
        hover: string;
        focus: string;
        error: string;
      };
      box: {
        primary: string;
        hover: string;
        highlight: string;
      };
      divider: {
        primary: string;
        highlight: string;
      };
    };
    background: {
      primary: string;
      secondary: string;
      highlight: string;
      deepHighlight: string;
      darkHighlight: string;
      error: string;
      box: {
        default: {
          primary: string;
          hover: string;
          active: string;
          inverse: string;
        };
        accent: {
          primary: string;
          hover: string;
          active: string;
          disabled: string;
        };
        error: {
          primary: string;
          hover: string;
          active: string;
        };
      };
      input: {
        primary: string;
        hover: string;
        disabled: string;
      };
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

// =======================
// Color Tokens
// =======================

export const colors = {
  grey50: '#FBFBFB',
  grey100: '#F5F6F8',
  grey200: '#EAEAEA',
  grey300: '#D4D4D4',
  grey400: '#B5B5B5',
  grey500: '#999999',
  grey600: '#808080',
  grey700: '#6B6B6B',
  grey800: '#525252',
  grey900: '#1A1A1A',

  greyOpacity50: 'rgba(245, 246, 248, 0.5)',
  greyOpacity100: 'rgba(234, 234, 234, 0.5)',
  greyOpacity200: 'rgba(212, 212, 212, 0.5)',
  greyOpacity300: 'rgba(181, 181, 181, 0.5)',
  greyOpacity400: 'rgba(153, 153, 153, 0.5)',
  greyOpacity500: 'rgba(128, 128, 128, 0.5)',
  greyOpacity600: 'rgba(107, 107, 107, 0.5)',
  greyOpacity700: 'rgba(82, 82, 82, 0.5)',
  greyOpacity800: 'rgba(26, 26, 26, 0.5)',
  greyOpacity900: 'rgba(0, 0, 0, 0.5)',

  white: '#FFFFFF',
  black: '#000000',

  blue50: '#E0F2FF',
  blue100: '#B3E0FF',
  blue200: '#80CCFF',
  blue300: '#4DB8FF',
  blue400: '#279EFF',
  blue500: '#1D8CE7',
  blue600: '#1A73E8',
  blue700: '#1451A5',
  blue800: '#0D3B73',
  blue900: '#096DBE',

  red50: '#FFEBEE',
  red100: '#FFCDD2',
  red200: '#EF9A9A',
  red300: '#E57373',
  red400: '#EF5350',
  red500: '#ff3d3d',
  red600: '#eb0000',
  red700: '#d32f2f',
  red800: '#c62828',
  red900: '#b71c1c',

  orange50: '#FFF3E0',
  orange100: '#FFE0B2',
  orange200: '#FFCC80',
  orange300: '#FFB74D',
  orange400: '#FFA726',
  orange500: '#FB8C00',
  orange600: '#F57C00',
  orange700: '#EF6C00',
  orange800: '#E65100',
  orange900: '#BF360C',

  yellow50: '#FFFDE7',
  yellow100: '#FFF9C4',
  yellow200: '#FFF59D',
  yellow300: '#FFF176',
  yellow400: '#FFEE58',
  yellow500: '#FFEB3B',
  yellow600: '#FDD835',
  yellow700: '#FBC02D',
  yellow800: '#F9A825',
  yellow900: '#F57F17',

  purple50: '#F3E5F5',
  purple100: '#E1BEE7',
  purple200: '#CE93D8',
  purple300: '#BA68C8',
  purple400: '#AB47BC',
  purple500: '#9C27B0',
  purple600: '#8E24AA',
  purple700: '#7B1FA2',
  purple800: '#6A1B9A',
  purple900: '#4A148C',

  teal50: '#E0F2F1',
  teal100: '#B2DFDB',
  teal200: '#80CBC4',
  teal300: '#4DB6AC',
  teal400: '#26A69A',
  teal500: '#009688',
  teal600: '#00897B',
  teal700: '#00796B',
  teal800: '#00695C',
  teal900: '#004D40',

  green50: '#E8F5E9',
  green100: '#C8E6C9',
  green200: '#A5D6A7',
  green300: '#81C784',
  green400: '#66BB6A',
  green500: '#4CAF50',
  green600: '#43A047',
  green700: '#388E3C',
  green800: '#2E7D32',
  green900: '#1B5E20',

  whiteOpacity50: 'rgba(255, 255, 255, 0.5)',
  whiteOpacity100: 'rgba(255, 255, 255, 0.6)',
  whiteOpacity200: 'rgba(255, 255, 255, 0.7)',
  whiteOpacity300: 'rgba(255, 255, 255, 0.8)',
  whiteOpacity400: 'rgba(255, 255, 255, 0.9)',
  whiteOpacity500: 'rgba(255, 255, 255, 0.95)',
  whiteOpacity600: 'rgba(255, 255, 255, 0.96)',
  whiteOpacity700: 'rgba(255, 255, 255, 0.97)',
  whiteOpacity800: 'rgba(255, 255, 255, 0.98)',
  whiteOpacity900: 'rgba(255, 255, 255, 0.99)',

  inverseGrey50: '#2C2C2C',
  inverseGrey100: '#3B3B3B',
  inverseGrey200: '#404040',
  inverseGrey300: '#474747',
  inverseGrey400: '#525252',
  inverseGrey500: '#636363',
  inverseGrey600: '#6B6B6B',
  inverseGrey700: '#787878',
  inverseGrey800: '#A6A6A6',
  inverseGrey900: '#EAEAEA',

  background: '#FFFFFF',
  darkBackground: '#1C1C1C',
  greyBackground: '#F5F6F8',
  darkGreyBackground: '#121212',
  layeredBackground: '#F2F2F2',
  darkLayeredBackground: '#2C2C2C',
  floatBackground: '#FFFFFF',
  darkFloatBackground: '#1C1C1C',
};

// =======================
// Base Theme
// =======================

const baseTheme = {
  typeScale: {
    xs: 'font-size: 0.75rem; line-height: 1rem;',
    sm: 'font-size: 0.875rem; line-height: 1.25rem;',
    base: 'font-size: 1rem; line-height: 1.5rem;',
    lg: 'font-size: 1.125rem; line-height: 1.75rem;',
    xl: 'font-size: 1.25rem; line-height: 1.75rem;',
    ['2xl']: 'font-size: 1.5rem; line-height: 2rem;',
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
    sm: '0.75rem',
    md: '1rem',
    lg: '1.25rem',
  },

  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '0.75rem',
    lg: '1rem',
    xl: '1.25rem',
    ['2xl']: '1.5rem',
    ['3xl']: '2rem',
    ['4xl']: '2.5rem',
    ['5xl']: '3.75rem',
  },
};

// =======================
// Light Theme
// =======================

export const lightTheme: Theme = {
  ...baseTheme,
  colors: {
    text: {
      white: colors.white,
      active: colors.grey900,
      inactive: colors.grey500,
      highlight: colors.blue500,
      secondary: colors.grey400,
      inverse: colors.grey200,
      error: colors.red500,
      black: colors.black,
    },
    line: {
      input: {
        primary: colors.grey300,
        hover: colors.grey600,
        focus: colors.blue500,
        error: colors.red500,
      },
      box: {
        primary: colors.grey300,
        hover: colors.grey800,
        highlight: colors.blue500,
      },
      divider: {
        primary: colors.grey200,
        highlight: colors.blue600,
      },
    },
    background: {
      primary: colors.background,
      secondary: colors.greyBackground,
      highlight: colors.blue500,
      deepHighlight: colors.blue600,
      darkHighlight: colors.blue700,
      error: colors.red500,
      box: {
        default: {
          primary: colors.layeredBackground,
          hover: colors.grey200,
          active: colors.grey300,
          inverse: colors.inverseGrey50,
        },
        accent: {
          primary: colors.blue500,
          hover: colors.blue600,
          active: colors.blue700,
          disabled: colors.grey700,
        },
        error: {
          primary: colors.red500,
          hover: colors.red600,
          active: colors.red700,
        },
      },
      input: {
        primary: colors.grey100,
        hover: colors.grey200,
        disabled: colors.grey200,
      },
    },
  },
  shadow: {
    onlyBottom: '0px 4px 4px rgba(39, 44, 86, 0.06)',
    dp01: '0px 10px 34px rgba(39, 44, 86, 0.1)',
    dp02: '0px 4px 12px rgba(39, 44, 86, 0.15)',
    dp03: '0px 12px 60px rgba(39, 44, 86, 0.2)',
    dp04: '0px 35px 64px rgba(39, 44, 86, 0.25)',
    inset: 'inset 0px 4px 4px rgba(0, 0, 0, 0.25)',
  },
};

// =======================
// Dark Theme
// =======================

export const darkTheme: Theme = {
  ...baseTheme,
  colors: {
    text: {
      white: colors.white,
      active: colors.inverseGrey900,
      inactive: colors.inverseGrey600,
      highlight: colors.blue600,
      secondary: colors.inverseGrey400,
      inverse: colors.inverseGrey900,
      error: colors.red600,
      black: colors.black,
    },
    line: {
      input: {
        primary: colors.inverseGrey300,
        hover: colors.inverseGrey500,
        focus: colors.blue600,
        error: colors.red600,
      },
      box: {
        primary: colors.inverseGrey400,
        hover: colors.grey300,
        highlight: colors.blue600,
      },
      divider: {
        primary: colors.inverseGrey400,
        highlight: colors.blue600,
      },
    },
    background: {
      primary: colors.darkBackground,
      secondary: colors.darkGreyBackground,
      highlight: colors.blue600,
      deepHighlight: colors.blue700,
      darkHighlight: colors.blue800,
      error: colors.red600,
      box: {
        default: {
          primary: colors.darkLayeredBackground,
          hover: colors.inverseGrey100,
          active: colors.inverseGrey200,
          inverse: colors.grey200,
        },
        accent: {
          primary: colors.blue600,
          hover: colors.blue700,
          active: colors.blue800,
          disabled: colors.inverseGrey700,
        },
        error: {
          primary: colors.red600,
          hover: colors.red700,
          active: colors.red800,
        },
      },
      input: {
        primary: colors.inverseGrey100,
        hover: colors.inverseGrey200,
        disabled: colors.inverseGrey200,
      },
    },
  },
  shadow: {
    onlyBottom: '0px 4px 4px rgba(0, 0, 0, 0.4)',
    dp01: '0px 10px 34px rgba(0, 0, 0, 0.6)',
    dp02: '0px 4px 12px rgba(0, 0, 0, 0.5)',
    dp03: '0px 12px 60px rgba(0, 0, 0, 0.7)',
    dp04: '0px 35px 64px rgba(0, 0, 0, 0.75)',
    inset: 'inset 0px 2px 6px rgba(255, 255, 255, 0.1)',
  },
};
