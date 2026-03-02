const { defineConfig } = require("cypress");
const allureWriter = require("@shelex/cypress-allure-plugin/writer");

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://demo.app.stack-it.ru/fl/",
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 30000,
    pageLoadTimeout: 60000,
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    supportFile: "cypress/support/e2e.js",
    fixturesFolder: "cypress/fixtures",
    downloadsFolder: "cypress/downloads",
    screenshotsFolder: "cypress/screenshots",
    videosFolder: "cypress/videos",
    video: false,
    screenshotOnRunFailure: true,
    retries: {
      runMode: 0,
      openMode: 0,
    },
    env: {
      login: "DEMOWEB",
      password: "awdrgy",
    },
    setupNodeEvents(on, config) {
      allureWriter(on, config);
      return config;
    },
  },
});
