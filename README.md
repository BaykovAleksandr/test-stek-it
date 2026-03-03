# Cypress Тестирование

Автоматизированные тесты для раздела **«Адреса проживающих»**.

Проект содержит набор автотестов на **Cypress** с формированием отчета в **Allure**.

---

## 📦 Установка

Установите зависимости проекта:

```
npm install
```

▶️ Запуск тестов (без Allure)
Вариант 1: В UI режиме

```
npx cypress open
```

Вариант 2: В консоли

```
npx cypress run
```

📊 Запуск тестов с Allure отчетом
Вариант 1: Полный цикл (тесты + отчет)

```
npm run allure:report
```

Вариант 2: По шагам

# 1. Запуск тестов со сбором данных для Allure

```
npm run test:allure
```

# 2. Генерация HTML отчета

```
npm run allure:generate
```

# 3. Открытие отчета в браузере

```
npm run allure:open
```

📜 Доступные команды

` npm test	` Запуск тестов (без Allure)

` npx cypress open	` Запуск Cypress в UI режиме

` npm run test:allure	` Запуск тестов со сбором данных для Allure

` npm run allure:report	`Полный цикл с генерацией и открытием отчета


🔄 CI/CD в GitHub Actions (Docker)

Тесты автоматически запускаются при каждом **push** в репозиторий.

- **Workflow:** `.github/workflows/cypress.yml`
- **Окружение:** job выполняется внутри Docker-контейнера **`cypress/browsers:latest`** (Node.js + Chrome, без установки Xvfb на хосте).
- **Секреты:** в настройках репозитория нужно задать `CYPRESS_LOGIN` и `CYPRESS_PASSWORD` для доступа к демо-приложению.

После прогона в разделе **Actions** доступны логи и артефакты (скриншоты при падении).



🧪 Покрытие тестами

Проект содержит 7 тестов для проверки функционала управления районами:

➕ Добавление нового района

✏️ Редактирование района

🗑️ Удаление района

⚠️ Валидация полей формы

🖥️ Проверка UI элементов

<img width="1920" height="1080" alt="allure1" src="https://github.com/user-attachments/assets/f7314fae-ff33-4ab7-aad5-4caa5a8676b4" />
<img width="1920" height="1080" alt="allure2" src="https://github.com/user-attachments/assets/c7d6589d-93fc-4d07-9533-2152bec8c360" />
<img width="1920" height="1080" alt="allure3" src="https://github.com/user-attachments/assets/73c91ef3-4d3d-41fd-9abe-68bdf5135b7c" />
