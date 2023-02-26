export {};
declare global {
  export interface Chainable<Subject = any> {
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
