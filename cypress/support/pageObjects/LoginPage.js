class LoginPage {
  visit() {
    cy.visit("/fl/", {
      timeout: 240000,
      retryOnNetworkFailure: true,
      retryOnStatusCodeFailure: true,
    });

    cy.location("pathname", { timeout: 60000 }).should("include", "/fl");
  }

  login() {
    const LOGIN = Cypress.env("LOGIN");
    const PASSWORD = Cypress.env("PASSWORD");
    this.visit();

    cy.get('[data-cy="login"]', { timeout: 60000 }).should("be.visible").type(LOGIN);
    cy.get('[data-cy="password"]').type(PASSWORD);
    cy.get('[data-cy="submit-btn"]').should("be.enabled").click();

    cy.wait(2000);

    cy.get("body").then(($body) => {
      cy.wait(2000);

      if ($body.find('[data-cy="stack-yes-no"]').length > 0) {
        cy.get('[data-cy="stack-yes-no"]', { timeout: 10000 })
          .should("be.visible")
          .within(() => {
            cy.get('[data-cy="btn-yes"]', { timeout: 5000 })
              .should("be.visible")
              .click({ force: true });
          });

        cy.get('[data-cy="stack-yes-no"]').should("not.exist");
        cy.wait(3000);
      }
    });

    cy.wait(6000);

    cy.get("a.borderleft3px.primary--text.v-list-item--active.main-menu-item", {
      timeout: 60000,
    }).should("be.visible");
  }
}

export default LoginPage;
