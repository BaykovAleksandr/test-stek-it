class DistrictDialog {
  isVisible() {
    cy.get('[data-cy="stack-dialog"]').should("be.visible");
    return this;
  }

  waitForClosed() {
    cy.get('[data-cy="stack-dialog"]', { timeout: 15000 }).should("not.exist");
    return this;
  }

  fillName(name) {
    cy.get('[data-test-id="Название района"]').clear().type(name);
    return this;
  }

  fillNumber(number) {
    cy.get('[data-test-id="Номер в списке"]').clear().type(number);
    return this;
  }

  save() {
    cy.get('[data-cy="btn-save"]').should("be.enabled").click();
    return this;
  }

  cancel() {
    cy.get('[data-cy="btn-cancel"]').click();
    return this;
  }

  verifyTitle(expected) {
    cy.get(".v-toolbar__title").should("contain", expected);
    return this;
  }

  verifySaveButtonState(disabled) {
    if (disabled) {
      cy.get('[data-cy="btn-save"]').should("be.disabled");
    } else {
      cy.get('[data-cy="btn-save"]').should("be.enabled");
    }
    return this;
  }

  getNumberInputValue() {
    return cy.get('[data-test-id="Номер в списке"]').invoke("val");
  }
}

export default DistrictDialog;
