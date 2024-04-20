// TODO: Fix command --> use Cypress.env() to get email and password to login
Cypress.Commands.add("login", () => {
  cy.visit("/home");
  cy.intercept(
    /https:\/\/swgcwu6tua\.execute-api\.ca-central-1\.amazonaws\.com\/dev\/api\/folder\/(\d+)$/,
  ).as("getFolderData");
  cy.get("input[name=email]").type(Cypress.env("login_email"));
  cy.get("input[name=password]").type(Cypress.env("login_password"));
  cy.get("button").contains("Sign In").click();
  cy.get("div[class=drawer]").should("be.visible");
  cy.wait("@getFolderData", { timeout: 5000 });
});
