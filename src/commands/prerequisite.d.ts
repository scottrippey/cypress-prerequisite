export {};

type MaybeStringOrCallback = string | null | ((error: Error) => string | null);

declare global {
  namespace Cypress {
    interface ResolvedConfigOptions<ComponentDevServerOpts = any> {
      /**
       * Determines what happens when a prerequisite fails.
       *
       * 'skip' (default) will mark the test as "skipped". The test suite will still pass.
       *
       * 'fail' will allow the test to fail. This is often used for local development or nightly builds.
       * If using `prerequisiteForSuite`, then the first test will fail, and the rest will be skipped.
       */
      prerequisiteBehavior?: "skip" | "fail";
      prerequisiteSkipMessage?: MaybeStringOrCallback;
      prerequisiteSkipSuiteMessage?: MaybeStringOrCallback;
    }
    interface Chainable<Subject = any> {
      /**
       * Runs some commands as a prerequisite for the test.
       * If any of these commands fail, the test will be
       * reported as "skipped" instead of "failed".
       */
      prerequisite(commands: () => void): Chainable<void>;

      /**
       * Runs some commands as a prerequisite for the test.
       * If any of these commands fail, the entire test suite will be
       * reported as "skipped" instead of "failed".
       */
      prerequisiteForSuite(commands: () => void): Chainable<void>;
    }
  }
}
