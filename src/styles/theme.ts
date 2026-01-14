// =======================
// Types
// =======================

import { colors } from './colors';

export type Theme = {
  name: 'light' | 'dark';
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

  space: {
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
      primary: string;
      secondary: string;
      disabled: string;
      inverse: string;
      accent: {
        default: string;
        hover: string;
        active: string;
      };
      error: string;
      white: string;
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
        active: string;
      };
      divider: {
        primary: string;
        accent: string;
      };
    };
    background: {
      layer0: string;
      layer1: string;
      accent: string;
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
        focus: string;
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

// Base Theme
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

  space: {
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

// Light Theme
export const lightTheme: Theme = {
  name: 'light',
  ...baseTheme,
  colors: {
    text: {
      primary: colors.blackOpacity87,
      secondary: colors.blackOpacity60,
      disabled: colors.blackOpacity38,
      accent: {
        default: colors.blue400,
        hover: colors.blue500,
        active: colors.blue600,
      },
      inverse: colors.grey200,
      error: colors.red500,
      white: colors.white,
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
        active: colors.blue500,
      },
      divider: {
        primary: colors.grey200,
        accent: colors.blue600,
      },
    },
    background: {
      layer0: colors.white,
      layer1: colors.grey100,
      accent: colors.blue400,
      error: colors.red500,
      box: {
        default: {
          primary: colors.grey50,
          hover: colors.grey100,
          active: colors.grey200,
          inverse: colors.grey300,
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
        focus: colors.grey300,
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

// Dark Theme
export const darkTheme: Theme = {
  name: 'dark',
  ...baseTheme,
  colors: {
    text: {
      primary: colors.whiteOpacity87,
      secondary: colors.whiteOpacity60,
      disabled: colors.whiteOpacity38,
      accent: {
        default: colors.blue400,
        hover: colors.blue300,
        active: colors.blue200,
      },
      inverse: colors.grey900,
      error: colors.red600,
      white: colors.white,
      black: colors.black,
    },
    line: {
      input: {
        primary: colors.grey800,
        hover: colors.grey700,
        focus: colors.blue600,
        error: colors.red600,
      },
      box: {
        primary: colors.grey400,
        hover: colors.grey300,
        active: colors.blue600,
      },
      divider: {
        primary: colors.grey400,
        accent: colors.blue600,
      },
    },
    background: {
      layer0: colors.grey900,
      layer1: colors.black,
      accent: colors.blue500,
      error: colors.red600,
      box: {
        default: {
          primary: colors.grey800,
          hover: colors.grey700,
          active: colors.grey600,
          inverse: colors.grey200,
        },
        accent: {
          primary: colors.blue600,
          hover: colors.blue700,
          active: colors.blue800,
          disabled: colors.grey700,
        },
        error: {
          primary: colors.red600,
          hover: colors.red700,
          active: colors.red800,
        },
      },
      input: {
        primary: colors.grey900,
        hover: colors.grey800,
        focus: colors.grey700,
        disabled: colors.grey200,
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
