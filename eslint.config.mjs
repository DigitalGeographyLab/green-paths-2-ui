import globals from 'globals';
import pluginJs from '@eslint/js';
import pluginReact from 'eslint-plugin-react';

export default [
  {
    extends: ['plugin:prettier/recommended'],
    files: ['**/*.{js,mjs,cjs,jsx}'],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        jest: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        describe: 'readonly',
      },
    },
    plugins: {
      js: pluginJs,
      react: pluginReact,
      prettier,
    },
    settings: {
      react: {
        version: 'detect', // Automatically detect the React version
      },
    },
    rules: {
      ...pluginJs.configs.recommended.rules,
      ...pluginReact.configs.recommended.rules,
      'react/prop-types': 'off', // Disable prop-types linting
      'prettier/prettier': 'error',
    },
  },
];
