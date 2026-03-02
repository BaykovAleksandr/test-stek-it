import globals from "globals";
import pluginJs from "@eslint/js";
import cypress from "eslint-plugin-cypress";
import prettier from "eslint-plugin-prettier";
import eslintConfigPrettier from "eslint-config-prettier";

export default [
  pluginJs.configs.recommended,
  eslintConfigPrettier,

  {
    files: ["**/*.js"],
    plugins: {
      cypress: cypress,
      prettier: prettier,
    },
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
        ...globals.mocha,
        cy: "readonly",
        Cypress: "readonly",
      },
    },
    rules: {
      ...cypress.configs.recommended.rules,
      "prettier/prettier": "error",
      quotes: ["error", "double", { avoidEscape: true }],
      "no-console": "warn",
      "cypress/no-unnecessary-waiting": "warn",
      "cypress/unsafe-to-chain-command": "warn",
    },
  },

  {
    ignores: [
      "node_modules/",
      "cypress/fixtures/",
      "cypress/videos/",
      "cypress/screenshots/",
      "coverage/",
    ],
  },
];
