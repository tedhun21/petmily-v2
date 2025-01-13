import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    fontSize: {
      s12h18: string;
      s14h21: string;
      s16h24: string;
      s18h27: string;
      s20h30: string;
    };
    fontWeight: {
      light: number;
      normal: number;
      bold: number;
      extrabold: number;
    };

    radius: {
      circle: string;
      normal: string;
      large: string;
    };

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
      box: {
        default: { primary: string; hover: string; active: string; opposite: string };
        blue: { primary: string; hover: string; active: string; disabled: string };
      };
      input: { primary: string; hover: string };
    };
    shadow: {
      onlyBottom: string;
      dp01: string;
      dp02: string;
      dp03: string;
      dp04: string;
      inset: string;
    };
  }
}
