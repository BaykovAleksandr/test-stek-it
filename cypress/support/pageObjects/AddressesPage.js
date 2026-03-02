class AddressesPage {
  openAddDistrictDialog() {
    cy.get('svg[viewBox="0 0 24 24"] path[d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"]')
      .first()
      .click();
    cy.contains("Район").click({ force: true });
    cy.get('[data-cy="stack-dialog"]').should("be.visible");
    cy.get(".v-toolbar__title").should("contain", "Район (создание)");
  }

  addDistrict(name, number = "1") {
    this.openAddDistrictDialog();

    cy.get('[data-test-id="Название района"]').clear().type(name);
    cy.get('[data-test-id="Номер в списке"]').clear().type(number);

    cy.get('[data-cy="btn-save"]').should("be.enabled").click();

    cy.get('[data-cy="stack-dialog"]', { timeout: 15000 }).should("not.exist");

    cy.contains(name, { timeout: 15000 }).should("exist");
  }

  deleteDistrict(name) {
    cy.contains(name).parents("tr").find('[data-cy="checkbox"]').check({ force: true });
    cy.get('[data-cy="btn-delete"]').click();
    cy.get(".v-dialog__content")
      .contains("button", /Да|Удалить|Подтвердить/)
      .click();
    cy.contains(name).should("not.exist");
  }

  findDistrictRow(name) {
    return cy.contains(name).parents("tr");
  }

  clickEditOnRow(row) {
    row.find('[data-cy="btn-edit"]').click();
  }
}

export default AddressesPage;
