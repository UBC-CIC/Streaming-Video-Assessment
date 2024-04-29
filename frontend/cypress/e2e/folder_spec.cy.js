describe("Testing Folder", () => {
  let folderName = "Test Folder";

  beforeEach(() => {
    cy.login();
  });

  describe("create a folder", () => {
    it("with valid input", () => {
      cy.contains("Create Folder").parents("div.dropdown").click();
      cy.get("ul.dropdown-content").contains("Create Folder").click();

      cy.get("input[placeholder='Folder Name']").first().type(folderName);

      cy.get("#folder-modal")
        .children("div.modal-box")
        .contains(/^Create$/)
        .click();

      cy.get("div[role=alert]")
        .should("have.class", "alert-success")
        .contains("Folder created successfully")
        .should("be.visible");

      cy.get("div.grid").contains(folderName).should("be.visible");
    });
  });

  describe("should delete a folder", () => {
    it("with no errors", () => {
      cy.get("div[draggable=true]")
        .contains(folderName)
        .parent()
        .siblings(".dropdown")
        .then(($el) => {
          $el.children("button").trigger("click");
          $el
            .children(".dropdown-content")
            .children()
            .children("button")
            .trigger("click");
        });
      cy.intercept(
        "DELETE",
        new RegExp(`${Cypress.env("backend-url")}/folder/(\\d+)/?$`),
      ).as("deleteFolder");
      cy.wait("@deleteFolder");
      cy.get("h5").contains(folderName).should("not.exist");
    });
  });
});
