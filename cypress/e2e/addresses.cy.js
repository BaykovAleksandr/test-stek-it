Cypress.on("uncaught:exception", () => false);

const LOGIN = "DEMOWEB";
const PASSWORD = "awdrgy";

function login() {
  cy.visit("/");

  cy.get('[data-cy="login"]', { timeout: 10000 })
    .should("be.visible")
    .type(LOGIN);
  cy.get('[data-cy="password"]').type(PASSWORD);
  cy.get('[data-cy="submit-btn"]').should("be.enabled").click();

  cy.wait(2000);

  cy.get("body").then(($body) => {
    cy.wait(1000); 

    if ($body.find('[data-cy="stack-yes-no"]').length > 0) {
      cy.log('Модалка "Пользователь уже вошел" обнаружена');

      cy.get('[data-cy="stack-yes-no"]', { timeout: 10000 })
        .should("be.visible")
        .within(() => {
          cy.get('[data-cy="btn-yes"]', { timeout: 5000 })
            .should("be.visible")
            .click({ force: true });
        });

      cy.get('[data-cy="stack-yes-no"]').should("not.exist");
    } else {
      cy.log('Модалка "Пользователь уже вошел" не обнаружена, продолжаем');
    }
  });

  cy.get("a.borderleft3px.primary--text.v-list-item--active.main-menu-item", {
    timeout: 30000,
  }).should("be.visible");
}

function navigateToAddresses() {
  cy.get('[data-test-id="Адресный фонд"]').click();
  cy.contains("Адреса проживающих").click();
  cy.contains("Адреса проживающих", { timeout: 15000 }).should("be.visible");
}

function openAddDistrictDialog() {
  cy.get(
    'svg[viewBox="0 0 24 24"] path[d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"]',
  )
    .first()
    .click();
  cy.contains("Район").click();
  cy.get('[data-cy="stack-dialog"]').should("be.visible");
  cy.get(".v-toolbar__title").should("contain", "Район (создание)");
}

function addDistrict(name, number = "1") {
  openAddDistrictDialog();

  cy.get('[data-test-id="Название района"]').clear().type(name);
  cy.get('[data-test-id="Номер в списке"]').clear().type(number);

  cy.get('[data-cy="btn-save"]').should("be.enabled").click();

 cy.get('[data-cy="stack-dialog"]', { timeout: 15000 }).should("not.exist");

  cy.contains(name, { timeout: 15000 }).should("exist");
}

function deleteDistrict(name) {
  cy.contains(name)
    .parents("tr")
    .find('[data-cy="checkbox"]')
    .check({ force: true });
  cy.get('[data-cy="btn-delete"]').click();
  cy.get(".v-dialog__content")
    .contains("button", /Да|Удалить|Подтвердить/)
    .click();
  cy.contains(name).should("not.exist");
}

describe('Тесты для раздела "Адреса проживающих"', () => {
  beforeEach(() => {
    login();
    navigateToAddresses();
  });

it("Проверка элементов диалогового окна добавления района", () => {
  openAddDistrictDialog();

  cy.get('[data-test-id="Название района"]').should("be.visible");
  cy.get('[data-test-id="Номер в списке"]').should("be.visible");

  cy.get('[data-cy="btn-save"]').should("be.visible").and("be.enabled");

  cy.get('[data-cy="btn-cancel"]').should("be.visible");
  cy.get(".v-toolbar__title").should("contain", "Район (создание)");
});

  it("Успешное добавление нового района", () => {
    const testDistrict = `Тестовый район ${Date.now()}`;
    addDistrict(testDistrict, "100");
  });

it("Валидация: нельзя ввести отрицательный или невалидный номер", () => {
  openAddDistrictDialog();

  cy.get('[data-test-id="Название района"]').type("Тестовый район");

  cy.get('[data-cy="btn-save"]').should("be.enabled");
  cy.screenshot("district-name-filled-button-active");

  cy.get('[data-test-id="Номер в списке"]').clear().type("-5");
  cy.get('[data-test-id="Номер в списке"]')
    .invoke("val")
    .then((val) => {
      if (val === "-5") {
        cy.log("БАГ: можно ввести отрицательный номер!");
        cy.screenshot("bug-negative-number");
      } else {
        cy.log("Отрицательный номер автоматически отклонён");
      }
    });

  cy.get('[data-test-id="Номер в списке"]').clear().type("abc");
  cy.get('[data-test-id="Номер в списке"]')
    .invoke("val")
    .then((val) => {
      if (val === "abc") {
        cy.log("БАГ: можно ввести нечисловое значение!");
        cy.screenshot("bug-nonnumeric-number");
      } else {
        cy.log("Нечисловое значение автоматически отклонено");
      }
    });

  cy.get('[data-cy="btn-save"]').should("be.disabled");

  cy.log("Валидация: кнопка disabled, если номер отрицательный или невалидный");
});

  it("Редактирование существующего района", () => {
    const originalName = `Редактируемый район ${Date.now()}`;
    const editedName = `Обновлённый район ${Date.now()}`;
    addDistrict(originalName, "200");

    cy.contains(originalName)
      .parents("tr")
      .find('[data-cy="btn-edit"]')
      .click();

    cy.get('[data-cy="stack-dialog"]')
      .should("be.visible")
      .within(() => {
        cy.get(".v-toolbar__title")
          .should("be.visible")
          .and("contain", "Район")
          .and("contain", "редактирование");
      });
    cy.get('[data-test-id="Название района"]').clear().type(editedName);
    cy.get('[data-test-id="Номер в списке"]').clear().type("300");
    cy.get('[data-cy="btn-save"]').click();
    cy.get('[data-cy="stack-dialog"]').should("not.exist");
    cy.contains(editedName).should("exist");
  });

  it("Удаление района", () => {
    const districtToDelete = `Удаляемый район ${Date.now()}`;
    addDistrict(districtToDelete, "400");
    deleteDistrict(districtToDelete);
  });

it("Валидация при добавлении района: кнопка активна/дизейбл в зависимости от полей", () => {
  openAddDistrictDialog();

  cy.get('[data-cy="btn-save"]').should("be.disabled");

  cy.get('[data-test-id="Название района"]').type("Тестовый район");

  cy.get('[data-cy="btn-save"]').should("be.enabled");

  cy.get('[data-test-id="Номер в списке"]').clear();

  cy.get('[data-cy="btn-save"]').should("be.disabled");

  cy.log(
    "Кнопка активна только если есть название района и номер; если номер пустой — кнопка disabled",
  );
});
  it("Отмена добавления района", () => {
    openAddDistrictDialog();
    cy.get('[data-test-id="Название района"]').type("Временный район");
    cy.get('[data-test-id="Номер в списке"]').type("50");
    cy.get('[data-cy="btn-cancel"]').click();
    cy.get('[data-cy="stack-dialog"]').should("not.exist");
    cy.contains("Временный район").should("not.exist");
  });
});
