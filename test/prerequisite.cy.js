describe("prerequisite", () => {
  it("passed: starts off fine", () => {
    //
  });
  it("skipped: here's a failing prerequisite, so it should be skipped alone", () => {
    cy.prerequisite(() => {
      // When this fails, this test will be skipped:
      cy.get("body", { timeout: 100 }).should("not.exist");
    });
    cy.then(() => {
      throw new Error("This error is not supposed to be reachable");
    });
  });

  it("passed: this should be fine", () => {
    //
  });

  it("passed: if there's no failure, it should continue", () => {
    cy.prerequisite(() => {
      cy.get("body").should("exist");
    });
    cy.get("body").should("exist");
  });

  describe("skip entire suite when prerequisite fails", () => {
    it("skipped: when this test fails, the whole suite is skipped", () => {
      cy.prerequisiteForSuite(() => {
        // When this fails, the whole suite will be skipped:
        cy.get("body", { timeout: 100 }).should("not.exist");
      });
      cy.then(() => {
        throw new Error("This error is not supposed to be reachable");
      });
    });
    it("skipped: because the prerequisite failed", () => {
      //
    });
  });

  describe("in a before block", () => {
    before(() => {
      cy.prerequisiteForSuite(() => {
        cy.get("body", { timeout: 100 }).should("not.exist");
      });
    });

    it("skipped: because before hook failed", () => {
      //
    });
    it("skipped: because before hook failed", () => {
      //
    });
  });
});
describe("config", { prerequisiteBehavior: "fail" }, () => {
  it("should fail", () => {
    cy.prerequisiteForSuite(() => {
      cy.get("body", { timeout: 100 }).should("not.exist");
    });
  });
  it("skipped: prerequisite failed", () => {
    //
  });
});

describe("these tests should error", () => {
  it("should fail: if there's no failure, it should continue, and then fail the test", () => {
    cy.prerequisite(() => {
      cy.get("body").should("exist");
    });
    cy.then(() => {
      throw new Error("This test is supposed to fail");
    });
  });
});
