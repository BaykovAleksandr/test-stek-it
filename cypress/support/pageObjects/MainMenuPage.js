class MainMenuPage {
  navigateToAddresses() {
    cy.get('[data-test-id="Адресный фонд"]').click();
    cy.contains("Адреса проживающих").click();
    cy.contains("Адреса проживающих", { timeout: 15000 }).should("be.visible");
  }
}

export default MainMenuPage;
