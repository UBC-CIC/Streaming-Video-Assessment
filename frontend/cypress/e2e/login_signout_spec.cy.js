describe("Testing Logging In and Signing Out", () => {
  describe("Login into application", () => {
    it("with correct credentials", () => {
      cy.login();
    });

    it("with incorrect credentials", () => {
      cy.visit("/home");
      cy.get("input[name=email]").type("wrong");
      cy.get("input[name=password]").type("wrong");
      cy.get("button").contains("Sign In").click();
      cy.get("div[role=alert]")
        .should("have.class", "alert-error")
        .contains(
          "There is no user associated with that email. Please create an account.",
        )
        .should("be.visible");
    });
  });

  it("Sign out of application", () => {
    cy.login();
    cy.get("label.drawer-button").click({ multiple: true });
    cy.get("div[class=drawer-side] ul li:first").click();
    cy.get("button").contains("Sign In").should("be.visible");
  });
});
