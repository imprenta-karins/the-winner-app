// eslint.config.mjs
import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import reactPlugin from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import globals from 'globals'
import prettier from 'eslint-config-prettier'

export default [
  // Ignorar artefactos y d.ts
  { ignores: ['**/node_modules/**', '**/dist/**', '**/build/**', '**/coverage/**', '**/*.d.ts'] },

  js.configs.recommended,

  // --- Backend (NestJS) ---
  ...tseslint.config({
    files: ['apps/backend/**/*.{ts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
      globals: { ...globals.node }, // process, console, __dirname, etc.
    },
    plugins: { '@typescript-eslint': tseslint.plugin },
    rules: {
      ...tseslint.configs.recommended[0].rules,
      ...tseslint.configs.stylistic[0].rules,
      // usa la versión TS de unused-vars
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      // evita falsos positivos al tener globals definidos
      'no-undef': 'off',
    },
  }),

  // --- Frontend (React + Vite + TS) ---
  ...tseslint.config({
    files: ['apps/frontend/**/*.{ts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: { ecmaVersion: 'latest', sourceType: 'module', ecmaFeatures: { jsx: true } },
      globals: { ...globals.browser }, // window, document, fetch, etc.
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      react: reactPlugin,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
    },
    settings: { react: { version: 'detect' } },
    rules: {
      ...tseslint.configs.recommended[0].rules,
      ...tseslint.configs.stylistic[0].rules,
      'react/react-in-jsx-scope': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'no-undef': 'off',
    },
  }),

  // Apaga reglas que chocan con Prettier
  prettier,
]
