export {};

declare global {
  namespace Cypress {
    interface ResolvedConfigOptions<ComponentDevServerOpts = any> {
      /**
       * Determines what happens when a tryOrSkip fails.
       *
       * 'skip' (default) will mark the test as "skipped". The test suite will still pass.
       *
       * 'fail' will allow the test to fail. This is often used for local development or nightly builds.
       * If using `tryOrSkipSuite`, then the first test will fail, and the rest will be skipped.
       */
      tryOrSkipBehavior?: "skip" | "fail";
      /**
       * When tryOrSkip fails, this message will be added to the skipped test title.
       *
       * This only works with `cypress run`.  It will not show in the `cypress open` UI.
       *
       * You can include the `error` message by including `<%= error %>`
       *
       * @example
       * // cypress.config.json
       *   "tryOrSkipMessage": " (skipped: <%= error %>)",
       *   "tryOrSkipSuiteMessage": " (skipped suite)",
       */
      tryOrSkipMessage?: string;
      /**
       * This message is used for tests that are skipped via `tryOrSkipSuite`
       */
      tryOrSkipSuiteMessage?: string;
    }
    interface Chainable<Subject = any> {
      /**
       * Tries to run some Cypress commands.
       * If any of these commands fail, the test will be
       * reported as "skipped" instead of "failed".
       */
      tryOrSkip(commands: () => void): Chainable<void>;

      /**
       * Tries to r un some Cypress commands.
       * If any of these commands fail, the entire test suite will be
       * reported as "skipped" instead of "failed".
       */
      tryOrSkipSuite(commands: () => void): Chainable<void>;
    }
  }
}
