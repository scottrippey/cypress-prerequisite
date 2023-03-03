Cypress.Commands.add("tryOrSkip", (commands) => {
  cy.on("fail", skipCurrent);
  commands();
  cy.then(() => cy.off("fail", skipCurrent));
});
Cypress.Commands.add("tryOrSkipSuite", (commands) => {
  cy.on("fail", skipSuite);
  commands();
  cy.then(() => cy.off("fail", skipSuite));
});

// Check each test to see if the parent was skipped:
beforeEach(skipCurrentIfSuiteFailed);

/** @returns {"skip"|"fail"|string} Returns the current configuration */
function tryOrSkipBehavior() {
  return Cypress.config("tryOrSkipBehavior") || "skip";
}
function tryOrSkipMessage() {
  return Cypress.config("tryOrSkipMessage") || null;
}
function tryOrSkipSuiteMessage() {
  return Cypress.config("tryOrSkipSuiteMessage") || null;
}

/** @returns {Mocha.Context} */
function getMochaContext() {
  return cy.state("runnable").ctx;
}
function skipCurrent(err) {
  if (tryOrSkipBehavior() === "skip") {
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
    test.parent.tryOrSkipSuiteFailed = test;
    test.parent.tryOrSkipSuiteFailed.tryOrSkipError = err;
  }

  if (tryOrSkipBehavior() === "skip") {
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
    test.id &&
    test.parent &&
    test.parent.tryOrSkipSuiteFailed &&
    test.id === test.parent.tryOrSkipSuiteFailed.id;
  if (isRetry) {
    test.parent.tryOrSkipSuiteFailed = null;
  }

  // Search ancestors to see if any parent suites were skipped:
  let parent = test.parent;
  while (parent) {
    if (parent.tryOrSkipSuiteFailed) {
      const err = parent.tryOrSkipSuiteFailed.tryOrSkipError;
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
    ? tryOrSkipSuiteMessage()
    : tryOrSkipMessage();

  if (skipMessage) {
    test.title += Cypress._.template(skipMessage)({ error });
  }
}
