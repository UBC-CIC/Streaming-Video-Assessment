describe("Testing Assessments", () => {
  let assessmentName = "Test Assessment";

  beforeEach(() => {
    cy.login();
  });

  describe("Create an Asssement", () => {
    beforeEach(() => {
      cy.contains("Create Submission").parents("div.dropdown").click();
      cy.get("ul.dropdown-content").contains("Create Submission").click();
    });

    it("testing invalid inputs", () => {
      cy.get("button").contains("Create").click();
      cy.contains("Submission name cannot be empty").should(
        "have.class",
        "text-red-600",
      );
      cy.contains("Submission Description cannot be empty").should(
        "have.class",
        "text-red-600",
      );
      cy.contains("Time limit should be set").should(
        "have.class",
        "text-red-600",
      );
      cy.contains("Due date should be in the future").should(
        "have.class",
        "text-red-600",
      );
    });

    it("testing valid inputs", () => {
      cy.get("input[placeholder='Submission Name']").type(assessmentName);
      cy.get("textarea").type("Test Description");
      cy.get("input[id='hours']").clear().type(1);
      cy.get("input[type='datetime-local']").type("2032-10-16T17:00");

      cy.contains("Share with a group").click();
      cy.contains("Sample Group").parent().click();
      cy.contains("Group: ").should("be.visible");

      cy.get("button").contains("Create").click();

      cy.get("div[role=alert]")
        .should("have.class", "alert-success")
        .contains("Assessment created successfully")
        .should("be.visible");
    });
  });

  describe("Edit an Assessment", () => {
    beforeEach(() => {
      cy.intercept(
        "GET",
        new RegExp(`${Cypress.env("backend-url")}/assessment/(\\d+)/?$`),
      ).as("getAssessmentData");
      cy.get("div[draggable=true]").contains(assessmentName).parent().click();
      cy.wait("@getAssessmentData");
    });

    it("changing inputs", () => {
      cy.contains(/^Edit$/).click();
      cy.intercept(
        "GET",
        new RegExp(`${Cypress.env("backend-url")}/assessment/shared/(\\d+)/?$`),
      ).as("getAssessmentData");
      cy.wait("@getAssessmentData");

      assessmentName = "Test Assessment Edited";
      cy.get("input[placeholder='Submission Name']")
        .clear()
        .type(assessmentName);

      cy.get("button").contains("Save").click();

      cy.get("div[role=alert]")
        .should("have.class", "alert-success")
        .contains("Assessment edits successfully")
        .should("be.visible");

      cy.wait("@getAssessmentData");

      cy.contains(assessmentName).should("exist");
    });

    it("testing closing an assessment", () => {
      cy.contains("Close Submission").click();
      cy.contains("Closed").should("have.class", "text-red-600");
    });

    it("testing opening an assessment", () => {
      cy.contains("Open Submission").click();
      cy.get("#assessment-open-dialog")
        .children()
        .children("div")
        .children()
        .eq(1)
        .children()
        .click();
      cy.contains("Open").should("have.class", "text-green-600");
    });
  });

  describe("Delete an Assessment", () => {
    it("with no errors", () => {
      cy.get("div[draggable=true]")
        .contains(assessmentName)
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
        new RegExp(`${Cypress.env("backend-url")}/assessment/(\\d+)/?$`),
      ).as("deleteAssessment");
      cy.wait("@deleteAssessment");
      cy.get("h5").contains(assessmentName).should("not.exist");
    });
  });
});
