# cypress-prerequisite
Skip tests if prerequisites aren't met.

In an ideal world, E2E tests have control over external dependencies, and there is no need for **conditional testing**.

Unfortunately, in practice, external dependencies are hard to control, and E2E tests will be brittle and flaky if they can't adapt.  

`cypress-prerequisite` enables easy conditional testing by skipping tests when prerequisites aren't met.

# Installation

Install the module as a `devDependency` via `npm install --save-dev cypress-prerequisite`

And in your `cypress/support/index.js` file, import the module:
```
import 'cypress-prerequisite`;
```

# Usage

## `cy.prerequisite(commands: () => void)`

In any test, wrap some Cypress commands with `cy.prerequisite(() => { ... })`.
If any of these commands fail, the test will be marked as **skipped**, not **failed**!

### Example: usage in a `it` block

In this example, if `#feature-a` does not exist, then the test will stop executing, and be marked as **skipped**.

```
it("if FEATURE A is enabled, clicking the button will open a modal", () => {
  cy.prerequisite(() => {
    cy.get("#feature-a").should("exist");
  });
  cy.get("#feature-a-button").click();
  cy.get("#feature-a-modal").should("be.visible");
});
```

### Example: usage in a `before` block

If used inside a `before` block, the **entire suite** (everything inside the `describe` block) will be skipped if the prerequisite fails.

```
describe("if FEATURE A is enabled", () => {
  before(() => {
    cy.prerequisite(() => {
      cy.get("#feature-a").should("exist");
    });
  });
  
  it("the button will be visible", () => {
    cy.get("#feature-a-button").should("be.visible");
  });
  
  it("clicking the button will open a modal", () => {
    cy.get("#feature-a-button").click();
    cy.get("#feature-a-modal").should("be.visible");
  });
});
```

If `#feature-a` does not exist, both of the tests in the `describe` block will be marked as "skipped".

# Configuration

### `prerequisiteBehavior: 'skip' | 'fail'`

`skip` (default)  
By default, a failed prerequisite means the test will be marked as "skipped", which means the tests will pass.
This works well in certain workflows, like Pull Request checks -- so that PRs don't get blocked by external dependencies.

`fail`  
However, this behavior can be disabled by setting `prerequisiteBehavior: 'fail'`.  
In this mode, if a prerequisite fails, the test will fail as normal.
This works well when you want to see failed dependencies -- such as in nightly builds, or for local development.


