// This file contains a bunch of failing tests.
// Currently, the only way to test these is to run
// and manually ensure all the failures.

const commands = {
  successful: (done = null) =>
    cy
      .get("body")
      .should("exist")
      .then(() => done?.()),
  error: () =>
    cy.wait(100).then(() => {
      throw new Error("err");
    }),
  thisShouldBeUnreachable: () =>
    cy.then(() => {
      const err = new Error("This code should not be reachable!");
      Error.captureStackTrace(err, commands.thisShouldBeUnreachable);
      throw err;
    }),
};

describe("these tests should error", () => {
  it("should fail: this command is fine, but the test has errors", () => {
    cy.tryOrSkip(() => {
      commands.successful();
    });
    commands.error();
  });
});

describe(
  "when tryOrSkipBehavior = 'fail'",
  { tryOrSkipBehavior: "fail" },
  () => {
    it("should fail: this test has a broken command", () => {
      cy.tryOrSkip(() => {
        commands.error();
      });
    });

    it("passes: this test is just fine", (done) => {
      cy.tryOrSkip(() => {
        commands.successful();
      });
      commands.successful(done);
    });

    it("should fail: this test has broken command", () => {
      cy.tryOrSkipSuite(() => {
        commands.error();
      });
    });
    it("skipped: previous tryOrSkipSuite failed", () => {
      commands.thisShouldBeUnreachable();
    });
  }
);
