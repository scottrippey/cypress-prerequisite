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

describe("config", { prerequisiteBehavior: "fail" }, () => {
  it("should fail: this test has broken prerequisites", () => {
    cy.prerequisiteForSuite(() => {
      commands.error();
    });
  });
  it("skipped: prerequisite failed", () => {
    commands.thisShouldBeUnreachable();
  });
});
describe("these tests should error", () => {
  it("should fail: if there's no failure, it should continue, and then fail the test", () => {
    cy.prerequisite(() => {
      commands.successful();
    });
    commands.error();
  });
});
