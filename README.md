# cypress-try-or-skip
Easy conditional testing with Cypress.  If a command fails, skip the test.

# Motivation

In an ideal world, E2E tests have control over external dependencies, and there is no need for **conditional testing**.

Unfortunately, in practice, external dependencies are hard to control, and E2E tests will be brittle and flaky if they can't adapt.  

`cypress-try-or-skip` enables easy conditional testing by skipping tests when a command (or assertion) fails.

# Installation

Install the module as a `devDependency` via `npm install --save-dev cypress-try-or-skip`

And in your `cypress/support/index.js` file, import the module:
```
import 'cypress-try-or-skip`;
```

# Usage

## `cy.tryOrSkip(commands: () => void)`

In any test, wrap some Cypress commands with `cy.tryOrSkip(() => { ... })`.
If any of these commands fail, the test will be marked as **skipped**, not **failed**!

### Example: usage in a `it` block

In this example, if `#feature-a` does not exist, then the test will stop executing, and be marked as **skipped**.

```
it("if FEATURE A is enabled, clicking the button will open a modal", () => {
  cy.tryOrSkip(() => {
    cy.get("#feature-a").should("exist");
  });
  cy.get("#feature-a-button").click();
  cy.get("#feature-a-modal").should("be.visible");
});
```

### Example: usage in a `before` block

If used inside a `before` block, the **entire suite** (everything inside the `describe` block) will be skipped if the command fails.

```
describe("if FEATURE A is enabled", () => {
  before(() => {
    cy.tryOrSkip(() => {
      cy.get("#feature-a").should("exist");
    });
  });
  
  it("the feature-a button will be visible", () => {
    cy.get("#feature-a-button").should("be.visible");
  });
  
  it("clicking the feature-a button will open a modal", () => {
    cy.get("#feature-a-button").click();
    cy.get("#feature-a-modal").should("be.visible");
  });
});
```

If `#feature-a` does not exist, both of the tests in the `describe` block will be marked as "skipped".

# Configuration

These settings can be configured in your `cypress.config.json` or can be supplied to the config option of `describe` or `it`.

### `tryOrSkipBehavior: 'skip' | 'fail'`

`skip` (default)  
By default, a failed command means the test will be marked as "skipped", which means the test suite will still pass.
This works well in certain workflows, like Pull Request checks -- so that PRs don't get blocked by external dependencies.

`fail`  
However, this behavior can be disabled by setting `tryOrSkipBehavior: 'fail'`.  
In this mode, if the command fails, the test will fail as normal.
If a `tryOrSkipSuite` fails, the test will fail as normal, and the rest of the tests in the suite will be skipped.
This setting is especially useful when you want to see failed dependencies -- such as in nightly builds, or for local development.

### `tryOrSkipMessage: string` and `tryOrSkipSuiteMessage: string`

When `tryOrSkip` fails, this message will be appended to the skipped test title.

**This only works with `cypress run`**.  The message will not show up in the `cypress open` UI.

Example:
```
// cypress.config.json
  "tryOrSkipMessage": " (skipped: <%= error %>)",
  "tryOrSkipSuiteMessage": " (skipped suite)",
```
Notice you can include the `error` in the message.

Example output:
```
~ if feature-a is enabled (skipped: AssertionError: Expected '#feature-a' to exist)
~ the feature-a button will be visible (skipped suite)
```
