const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    retries: {
      runMode: 2,
      openMode: 2,
    },
    specPattern: ["test/**/*.cy.{js,jsx,ts,tsx}"],
    // excludeSpecPattern: ["prerequisite-failres.cy.js"],
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
