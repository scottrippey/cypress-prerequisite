const commands = {
  successful: (done = null) =>
    cy
      .get("body")
      .should("exist")
      .then(() => done?.()),
  error: () => cy.get("body", { timeout: 100 }).should("be.empty"),
  thisShouldBeUnreachable: () =>
    cy.then(() => {
      const err = new Error("This code should not be reachable!");
      Error.captureStackTrace(err, commands.thisShouldBeUnreachable);
      throw err;
    }),
};

describe("tryOrSkip", () => {
  it("passed: starts off fine", () => {
    commands.successful();
  });
  it("skipped: here's a failing command, so it should be skipped alone", () => {
    cy.tryOrSkip(() => {
      // When this fails, this test will be skipped:
      commands.error();
    });
    commands.thisShouldBeUnreachable();
  });

  it("passed: this should be fine", () => {
    //
  });

  it("passed: if there's no failure, it should continue", (done) => {
    cy.tryOrSkip(() => {
      commands.successful();
    });
    commands.successful(done);
  });

  describe("in a before block", () => {
    before(() => {
      cy.tryOrSkip(() => {
        commands.error();
      });
    });

    it("skipped: because before hook failed", () => {
      commands.thisShouldBeUnreachable();
    });
    it("skipped: because before hook failed", () => {
      commands.thisShouldBeUnreachable();
    });
  });
});

describe("tryOrSkipSuite", () => {
  it("passed: ths should never be skipped", () => {
    commands.successful();
  });

  describe("skip entire suite once the command fails", () => {
    it("passed: when command passes", (done) => {
      cy.tryOrSkipSuite(() => {
        commands.successful();
      });
      commands.successful(done);
    });

    it("skipped: when this test fails, the rest of the suite is skipped", () => {
      cy.tryOrSkipSuite(() => {
        // When this fails, the whole suite will be skipped:
        commands.error();
      });
      commands.thisShouldBeUnreachable();
    });

    it("skipped: because the command failed", () => {
      commands.thisShouldBeUnreachable();
    });
  });

  // describe("in a before block", () => {
  //   before(() => {
  //     cy.tryOrSkipSuite(() => {
  //       commands.error();
  //     });
  //   });
  //
  //   it("skipped: because before hook failed", () => {
  //     commands.thisShouldBeUnreachable();
  //   });
  //   it("skipped: because before hook failed", () => {
  //     commands.thisShouldBeUnreachable();
  //   });
  // });
});

describe(
  "tryOrSkipMessage",
  {
    tryOrSkipMessage: ` (skipped: <%= error %>)`,
    tryOrSkipSuiteMessage: ` (skipped suite)`,
  },
  () => {
    it("skipped: command failed", () => {
      cy.tryOrSkip(() => {
        commands.error();
      });
    });

    it("skipped: tryOrSkipSuite failed", () => {
      cy.tryOrSkipSuite(() => {
        commands.error();
      });
    });

    it("skipped: previous failed", () => {
      commands.thisShouldBeUnreachable();
    });
  }
);
