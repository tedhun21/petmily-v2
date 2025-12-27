import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import emotion from '@emotion/eslint-plugin';
import prettierConfig from 'eslint-config-prettier';

export default [
  // 1. 검사 제외 대상
  { ignores: ['dist', 'node_modules'] },

  // 2. 기본 권장 설정 (JS, TS)
  js.configs.recommended,
  ...tseslint.configs.recommended,

  // 3. React 및 Emotion 핵심 설정
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      react: react,
      'react-hooks': reactHooks,
      '@emotion': emotion,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,

      // Emotion & React 설정 (핵심)
      'react/react-in-jsx-scope': 'off', // React 17+ 필수
      '@emotion/pkg-renaming': 'error',

      // 불필요한 경고 끄기
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['warn'],
    },
  },

  // 4. Prettier 설정 덮어쓰기
  prettierConfig,
];
