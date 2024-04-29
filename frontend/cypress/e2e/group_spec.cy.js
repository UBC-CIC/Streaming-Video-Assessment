describe("Testing Groups", () => {
  let groupName = "Test Group Before Edit";

  beforeEach(() => {
    cy.login();
  });

  describe("create a group", () => {
    beforeEach(() => {
      cy.contains("Create Group").parents("div.dropdown").click();
      cy.get("ul.dropdown-content").contains("Create Group").click();
    });

    it("with valid input", () => {
      cy.get("input[placeholder='Group Name']").first().type(groupName);

      cy.get("input[placeholder='Name']").first().type("Test User");
      cy.get("input[placeholder='Email']").first().type("test@gmail.com");

      cy.get("button").contains(/^Add$/).click();

      cy.get("button").contains("Create").click();

      cy.get("div[role=alert]")
        .should("have.class", "alert-success")
        .contains("Group created successfully")
        .should("be.visible");

      cy.get("div.grid").contains(groupName).should("be.visible");
    });

    it("with blank inputs", () => {
      cy.get("button").contains(/^Add$/).click();
      cy.get("button").contains("Create").click();

      cy.get("div").contains("Group name cannot be empty").should("be.visible");
      cy.get("div").contains("Name cannot be empty").should("be.visible");
      cy.get("div").contains("Email cannot be empty").should("be.visible");
    });

    it("with invalid email", () => {
      cy.get("input[placeholder='Email']").first().type("test");

      cy.get("button").contains(/^Add$/).click();

      cy.get("div").contains("Invalid email format").should("be.visible");
    });
  });

  describe("Edit a group", () => {
    beforeEach(() => {
      cy.get("div[draggable=true]").contains(groupName).parent().click();
      cy.intercept(
        "GET",
        new RegExp(`${Cypress.env("backend-url")}/group/(\\d+)/?$`),
      ).as("getGroupData");
      cy.wait("@getGroupData");
    });

    it("change group name", () => {
      groupName = "Test Group";
      cy.get("input[placeholder='Group Name']").eq(2).clear().type(groupName);
      cy.get("div.right-5").eq(2).children().click();

      cy.get("div[role=alert]")
        .should("have.class", "alert-success")
        .contains("Group edited successfully")
        .should("be.visible");

      cy.get("div.grid").contains(groupName).should("be.visible");
    });

    it("add a new user", () => {
      cy.get("input[placeholder='Name']").eq(2).type("Test User 2");
      cy.get("input[placeholder='Email']").eq(2).type("test2@gmail.com");

      cy.get("input[placeholder='Name']").eq(2).siblings("button").click();

      cy.get("div.right-5").eq(2).children().click();

      cy.get("div[role=alert]")
        .should("have.class", "alert-success")
        .contains("Group edited successfully")
        .should("be.visible");

      cy.get("div[draggable=true]").contains(groupName).parent().click();
      cy.intercept(
        "GET",
        new RegExp(`${Cypress.env("backend-url")}/group/(\\d+)/?$`),
      ).as("getGroupData");
      cy.wait("@getGroupData");

      cy.get("div").contains("Test User 2").should("be.visible");
    });

    it("remove a user", () => {
      cy.get("div")
        .contains("Test User 2")
        .parent()
        .siblings("div.btn")
        .click({ force: true });
      cy.get("div.right-5").eq(2).children().click();

      cy.get("div[role=alert]")
        .should("have.class", "alert-success")
        .contains("Group edited successfully")
        .should("be.visible");

      cy.get("div[draggable=true]").contains(groupName).parent().click();
      cy.intercept(
        "GET",
        new RegExp(`${Cypress.env("backend-url")}/group/(\\d+)/?$`),
      ).as("getGroupData");
      cy.wait("@getGroupData");

      cy.contains("Test User 2").should("not.exist");
    });
  });

  describe("should delete a group", () => {
    it("with no errors", () => {
      cy.get("div[draggable=true]")
        .contains(groupName)
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
        new RegExp(`${Cypress.env("backend-url")}/group/(\\d+)/?$`),
      ).as("deleteGroup");
      cy.wait("@deleteGroup");
      cy.get("h5").contains(groupName).should("not.exist");
    });
  });
});
