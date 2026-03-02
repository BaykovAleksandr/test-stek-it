import globals from 'globals';
import pluginJs from '@eslint/js';
import cypress from 'eslint-plugin-cypress';

export default [
  pluginJs.configs.recommended,

  {
    files: ['**/*.js'],
    plugins: {
      cypress: cypress,
    },
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
        ...globals.mocha,
        cy: 'readonly',
        Cypress: 'readonly',
      },
    },
    rules: {
      ...cypress.configs.recommended.rules,
      quotes: ['error', 'single', { avoidEscape: true }],
      'no-console': 'warn',
      'cypress/no-unnecessary-waiting': 'warn',
      'cypress/unsafe-to-chain-command': 'warn',
    },
  },

  {
    ignores: [
      'node_modules/',
      'cypress/fixtures/',
      'cypress/videos/',
      'cypress/screenshots/',
      'coverage/',
    ],
  },
];
