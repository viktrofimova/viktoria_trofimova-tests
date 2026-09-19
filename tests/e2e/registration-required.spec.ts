import { test, expect } from "@playwright/test";
import { makeUser } from "../helpers/user";
import { RegisterPage } from "../pages/register-page";

test.describe("Обязательные поля регистрации", () => {
  test("Имя обязательно для регистрации", async ({ page }) => {
    const user = makeUser("registration-required-name", Date.now());
    const registerPage = new RegisterPage(page);

    await test.step("Пользователь открывает страницу регистрации", async () => {
      await registerPage.goto();
    });

    await test.step("Проверяем, что открылась страница регистрации", async () => {
      await expect(registerPage.registerButton()).toBeVisible();
    });

    await test.step("Пользователь заполняет email и пароль", async () => {
      await registerPage.fillEmail(user.email);
      await registerPage.fillPassword(user.password);
    });

    await test.step("Проверяем, что email и пароль заполнены", async () => {
      await expect(registerPage.emailInput()).toHaveValue(user.email);
      await expect(registerPage.passwordInput()).toHaveValue(user.password);
    });

    await test.step("Пользователь отправляет форму без имени", async () => {
      await registerPage.submit();
    });

    await test.step("Проверяем, что поле имени не прошло валидацию", async () => {
      expect(await registerPage.isNameInvalid()).toBe(true);
    });
  });

  test("Email обязательно для регистрации", async ({ page }) => {
    const user = makeUser("registration-required-email", Date.now());
    const registerPage = new RegisterPage(page);

    await test.step("Пользователь открывает страницу регистрации", async () => {
      await registerPage.goto();
    });

    await test.step("Проверяем, что открылась страница регистрации", async () => {
      await expect(registerPage.registerButton()).toBeVisible();
    });

    await test.step("Пользователь заполняет имя и пароль", async () => {
      await registerPage.fillName(user.name);
      await registerPage.fillPassword(user.password);
    });

    await test.step("Проверяем, что имя и пароль заполнены", async () => {
      await expect(registerPage.nameInput()).toHaveValue(user.name);
      await expect(registerPage.passwordInput()).toHaveValue(user.password);
    });

    await test.step("Пользователь отправляет форму без email", async () => {
      await registerPage.submit();
    });

    await test.step("Проверяем, что поле email не прошло валидацию", async () => {
      expect(await registerPage.isEmailInvalid()).toBe(true);
    });
  });

  test("Пароль обязательно для регистрации", async ({ page }) => {
    const user = makeUser("registration-required-password", Date.now());
    const registerPage = new RegisterPage(page);

    await test.step("Пользователь открывает страницу регистрации", async () => {
      await registerPage.goto();
    });

    await test.step("Проверяем, что открылась страница регистрации", async () => {
      await expect(registerPage.registerButton()).toBeVisible();
    });

    await test.step("Пользователь заполняет имя и email", async () => {
      await registerPage.fillName(user.name);
      await registerPage.fillEmail(user.email);
    });

    await test.step("Проверяем, что имя и email заполнены", async () => {
      await expect(registerPage.nameInput()).toHaveValue(user.name);
      await expect(registerPage.emailInput()).toHaveValue(user.email);
    });

    await test.step("Пользователь отправляет форму без пароля", async () => {
      await registerPage.submit();
    });

    await test.step("Проверяем, что поле пароля не прошло валидацию", async () => {
      expect(await registerPage.isPasswordInvalid()).toBe(true);
    });
  });
});