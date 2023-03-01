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

describe("prerequisite", () => {
  it("passed: starts off fine", () => {
    commands.successful();
  });
  it("skipped: here's a failing prerequisite, so it should be skipped alone", () => {
    cy.prerequisite(() => {
      // When this fails, this test will be skipped:
      commands.error();
    });
    commands.thisShouldBeUnreachable();
  });

  it("passed: this should be fine", () => {
    //
  });

  it("passed: if there's no failure, it should continue", (done) => {
    cy.prerequisite(() => {
      commands.successful();
    });
    commands.successful(done);
  });

  describe("in a before block", () => {
    before(() => {
      cy.prerequisite(() => {
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

describe("prerequisiteForSuite", () => {
  it("passed: ths should never be skipped", () => {
    commands.successful();
  });

  describe("skip entire suite once prerequisite fails", () => {
    it("passed: when prerequisite passes", (done) => {
      cy.prerequisiteForSuite(() => {
        commands.successful();
      });
      commands.successful(done);
    });

    it("skipped: when this test fails, the rest of the suite is skipped", () => {
      cy.prerequisiteForSuite(() => {
        // When this fails, the whole suite will be skipped:
        commands.error();
      });
      commands.thisShouldBeUnreachable();
    });

    it("skipped: because the prerequisite failed", () => {
      commands.thisShouldBeUnreachable();
    });
  });

  // describe("in a before block", () => {
  //   before(() => {
  //     cy.prerequisiteForSuite(() => {
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
  "prerequisiteSkipMessage",
  {
    prerequisiteSkipMessage: ` (skipped: <%= error %>)`,
    prerequisiteSkipSuiteMessage: ` (skipped suite)`,
  },
  () => {
    it("skipped: prerequisite failed", () => {
      cy.prerequisite(() => {
        commands.error();
      });
    });

    it("skipped: prerequisiteForSuite failed", () => {
      cy.prerequisiteForSuite(() => {
        commands.error();
      });
    });

    it("skipped: previous failed", () => {
      commands.thisShouldBeUnreachable();
    });
  }
);
