const { defineConfig } = require("cypress");
const allureWriter = require("@shelex/cypress-allure-plugin/writer");

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://demo.app.stack-it.ru",
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 30000,
    pageLoadTimeout: 180000,
    chromeWebSecurity: false,
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    supportFile: "cypress/support/e2e.js",
    fixturesFolder: "cypress/fixtures",
    downloadsFolder: "cypress/downloads",
    screenshotsFolder: "cypress/screenshots",
    videosFolder: "cypress/videos",
    video: false,
    screenshotOnRunFailure: true,
    retries: {
      runMode: 2,
      openMode: 0,
    },
    env: {
      LOGIN: "DEMOWEB",
      PASSWORD: "awdrgy",
    },
    setupNodeEvents(on, config) {
      allureWriter(on, config);
      on("before:browser:launch", (browser, launchOptions) => {
        if (browser.family === "chromium") {
          launchOptions.args.push("--disable-dev-shm-usage");
          launchOptions.args.push("--no-sandbox");
          launchOptions.args.push("--disable-gpu");
        }
        return launchOptions;
      });
      return config;
    },
  },
});
