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
function prerequisiteSkipMessage() {
  return Cypress.config("prerequisiteSkipMessage") || null;
}
function prerequisiteSkipSuiteMessage() {
  return Cypress.config("prerequisiteSkipSuiteMessage") || null;
}

/** @returns {Mocha.Context} */
function getMochaContext() {
  return cy.state("runnable").ctx;
}
function skipCurrent(err) {
  if (prerequisiteBehavior() === "skip") {
    const ctx = getMochaContext();
    const test = ctx.currentTest || ctx.test;
    updateTitle(test, err);
    ctx.skip(); // (throws)
  } else {
    throw err;
  }
}
function skipSuite(err) {
  const ctx = getMochaContext();
  const test = ctx.currentTest || ctx.test;

  // Mark the parent as failed
  if (test.parent) {
    test.parent.prerequisiteForSuiteFailed = test;
    test.parent.prerequisiteForSuiteFailed.prerequisiteError = err;
  }

  if (prerequisiteBehavior() === "skip") {
    updateTitle(test, err);
    ctx.skip(); // (throws)
  } else {
    throw err;
  }
}
function skipCurrentIfSuiteFailed() {
  const ctx = getMochaContext();
  const test = ctx.currentTest || ctx.test;

  // If this is an automatic retry, erase the previous failure:
  const isRetry =
    test.id && test.id === test.parent?.prerequisiteForSuiteFailed?.id;
  if (isRetry) {
    test.parent.prerequisiteForSuiteFailed = null;
  }

  // Search ancestors to see if any parent suites were skipped:
  let parent = test.parent;
  while (parent) {
    if (parent.prerequisiteForSuiteFailed) {
      const err = parent.prerequisiteForSuiteFailed.prerequisiteError;
      updateTitle(test, err, true);
      ctx.skip(); // (throws)
    }
    parent = parent.parent;
  }
}

/**
 * Updates the test title.
 * This only has an effect in `cypress run` mode;
 * the Cypress UI does not update titles.
 */
function updateTitle(test, error, wasSuiteFailure) {
  let skipMessage = wasSuiteFailure
    ? prerequisiteSkipSuiteMessage()
    : prerequisiteSkipMessage();

  if (skipMessage) {
    test.title += Cypress._.template(skipMessage)({ error });
  }
}
