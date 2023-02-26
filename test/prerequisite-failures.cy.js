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
  it("should fail: this prerequisite is fine, but the test has errors", () => {
    cy.prerequisite(() => {
      commands.successful();
    });
    commands.error();
  });
});

describe(
  "when prerequisiteBehavior = 'fail'",
  { prerequisiteBehavior: "fail" },
  () => {
    it("should fail: this test has a broken prerequisite", () => {
      cy.prerequisite(() => {
        commands.error();
      });
    });

    it("passes: this test is just fine", (done) => {
      cy.prerequisite(() => {
        commands.successful();
      });
      commands.successful(done);
    });

    it("should fail: this test has broken prerequisitesForSuite", () => {
      cy.prerequisiteForSuite(() => {
        commands.error();
      });
    });
    it("skipped: previous prerequisiteForSuite failed", () => {
      commands.thisShouldBeUnreachable();
    });
  }
);
