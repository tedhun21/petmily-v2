import '@emotion/react';
import { Theme as CustomTheme } from '../styles/theme';

declare module '@emotion/react' {
  export type Theme = CustomTheme;
}
