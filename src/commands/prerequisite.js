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
