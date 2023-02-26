Cypress.Commands.add("prerequisite", (commands) => {
  cy.on("fail", skipCurrent);
  commands();
  cy.then(() => cy.off("fail", skipCurrent));
});
Cypress.Commands.add("prerequisiteForSuite", (commands) => {
  cy.on("fail", skipSuite);
  commands();
  cy.then(() => cy.off("fail", skipSuite));
});

// Check each test to see if the parent was skipped:
beforeEach(skipCurrentIfSuiteFailed);

/** @returns {"skip"|"fail"|string} Returns the current configuration */
function prerequisiteBehavior() {
  return Cypress.config("prerequisiteBehavior") || "skip";
}

/** @returns {Mocha.Context} */
function getMochaContext() {
  return cy.state("runnable").ctx;
}
function skipCurrent(err) {
  if (prerequisiteBehavior() === "skip") {
    const ctx = getMochaContext();
    ctx.skip(); // (throws)
  } else {
    throw err;
  }
}
function skipSuite(err) {
  const ctx = getMochaContext();
  const test = ctx.currentTest || ctx.test;

  // Mark the parent as failed
  if (test.parent) test.parent.prerequisiteForSuiteFailed = true;

  if (prerequisiteBehavior() === "skip") {
    ctx.skip(); // (throws)
  } else {
    throw err;
  }
}
function skipCurrentIfSuiteFailed() {
  const ctx = getMochaContext();
  const test = ctx.currentTest || ctx.test;

  // Search ancestors to see if any parent suites were skipped:
  let parent = test.parent;
  while (parent) {
    if (parent.prerequisiteForSuiteFailed === true) {
      ctx.skip(); // (throws)
    }
    parent = parent.parent;
  }
}
