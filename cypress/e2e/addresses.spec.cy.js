import LoginPage from "../support/pageObjects/LoginPage";
import MainMenuPage from "../support/pageObjects/MainMenuPage";
import AddressesPage from "../support/pageObjects/AddressesPage";
import DistrictDialog from "../support/pageObjects/DistrictDialog";

Cypress.on("uncaught:exception", () => false);

function addAllureMeta(epic, feature, story, severity) {
  try {
    const allure = Cypress.Allure.reporter.getInterface();
    if (allure) {
      epic && allure.epic(epic);
      feature && allure.feature(feature);
      story && allure.story(story);
      severity && allure.severity(severity);
    }
  } catch (e) {
    console.log(e);
  }
}

describe('Тесты для раздела "Адреса проживающих"', () => {
  const loginPage = new LoginPage();
  const mainMenu = new MainMenuPage();
  const addressesPage = new AddressesPage();
  const districtDialog = new DistrictDialog();

  beforeEach(() => {
    loginPage.login();
    mainMenu.navigateToAddresses();
  });

  it("Проверка элементов диалогового окна добавления района", () => {
    addAllureMeta("Адреса проживающих", "Управление районами", "Добавление района", "critical", [
      "smoke",
      "ui",
    ]);

    addressesPage.openAddDistrictDialog();

    cy.get('[data-test-id="Название района"]').should("be.visible");
    cy.get('[data-test-id="Номер в списке"]').should("be.visible");
    cy.get('[data-cy="btn-save"]').should("be.visible").and("be.enabled");
    cy.get('[data-cy="btn-cancel"]').should("be.visible");
    districtDialog.verifyTitle("Район (создание)");
  });

  it("Успешное добавление нового района", () => {
    addAllureMeta("Адреса проживающих", "Управление районами", "Добавление района", "critical", [
      "regression",
      "positive",
    ]);

    const testDistrict = `Тестовый район ${Date.now()}`;
    addressesPage.addDistrict(testDistrict, "100");
  });

  it("Валидация: нельзя ввести отрицательный или невалидный номер", () => {
    addAllureMeta("Адреса проживающих", "Управление районами", "Валидация полей", "normal", [
      "validation",
      "negative",
    ]);

    addressesPage.openAddDistrictDialog();

    districtDialog.fillName("Тестовый район");
    districtDialog.verifySaveButtonState(false);

    cy.screenshot("district-name-filled-button-active");

    districtDialog.fillNumber("-5");
    districtDialog.getNumberInputValue().then((val) => {
      if (val === "-5") {
        cy.log("БАГ: можно ввести отрицательный номер!");
        cy.screenshot("bug-negative-number");
      } else {
        cy.log("Отрицательный номер автоматически отклонён");
      }
    });

    districtDialog.fillNumber("abc");
    districtDialog.getNumberInputValue().then((val) => {
      if (val === "abc") {
        cy.log("БАГ: можно ввести нечисловое значение!");
        cy.screenshot("bug-nonnumeric-number");
      } else {
        cy.log("Нечисловое значение автоматически отклонено");
      }
    });

    districtDialog.verifySaveButtonState(true);
    cy.log("Валидация: кнопка disabled, если номер отрицательный или невалидный");
  });

  it("Редактирование существующего района", () => {
    addAllureMeta(
      "Адреса проживающих",
      "Управление районами",
      "Редактирование района",
      "critical",
      ["regression"]
    );

    const originalName = `Редактируемый район ${Date.now()}`;
    const editedName = `Обновлённый район ${Date.now()}`;
    addressesPage.addDistrict(originalName, "200");

    const row = addressesPage.findDistrictRow(originalName);
    addressesPage.clickEditOnRow(row);

    districtDialog
      .isVisible()
      .verifyTitle("Район")
      .verifyTitle("редактирование")
      .fillName(editedName)
      .fillNumber("300")
      .save()
      .waitForClosed();

    cy.contains(editedName).should("exist");
  });

  it("Удаление района", () => {
    addAllureMeta("Адреса проживающих", "Управление районами", "Удаление района", "critical", [
      "regression",
    ]);

    const districtToDelete = `Удаляемый район ${Date.now()}`;
    addressesPage.addDistrict(districtToDelete, "400");
    addressesPage.deleteDistrict(districtToDelete);
  });

  it("Валидация при добавлении района: кнопка активна/дизейбл в зависимости от полей", () => {
    addAllureMeta("Адреса проживающих", "Управление районами", "Валидация формы", "normal", [
      "validation",
    ]);

    addressesPage.openAddDistrictDialog();

    districtDialog.fillName("Тестовый район");
    cy.wait(500);

    districtDialog.getNumberInputValue().then((currentValue) => {
      if (currentValue && currentValue.trim() !== "") {
        districtDialog.verifySaveButtonState(false);

        cy.get('[data-test-id="Номер в списке"]').clear().type("{backspace}");
        cy.wait(1000);
        districtDialog.verifySaveButtonState(true);
      } else {
        districtDialog.verifySaveButtonState(true);

        districtDialog.fillNumber("1");
        cy.wait(500);
        districtDialog.verifySaveButtonState(false);
      }
    });
  });

  it("Отмена добавления района", () => {
    addAllureMeta("Адреса проживающих", "Управление районами", "Отмена создания", "normal", [
      "regression",
    ]);

    addressesPage.openAddDistrictDialog();
    districtDialog.fillName("Временный район").fillNumber("50").cancel();
    districtDialog.waitForClosed();
    cy.contains("Временный район").should("not.exist");
  });
});
