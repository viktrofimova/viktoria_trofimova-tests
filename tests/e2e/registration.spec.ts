import { test, expect } from "@playwright/test";
import { deleteUserViaApi, makeUser } from "../helpers/user";
import { RegisterPage } from "../pages/register-page";
import { ProfilePage } from "../pages/profile-page";

test.describe("Регистрация", () => {
  let registerPage: RegisterPage;
  let profilePage: ProfilePage;

  test.beforeEach(async ({ page }) => {
    registerPage = new RegisterPage(page);
    profilePage = new ProfilePage(page);
  });

  test.afterEach(async ({ page }) => {
    await deleteUserViaApi(page.context().request).catch(() => undefined);
  });

  test("После регистрации создаётся профиль с именем из формы и часовым поясом Europe/Moscow", async ({
    page,
  }) => {
    const user = makeUser("registration-profile", Date.now());

    await test.step("Пользователь открывает страницу регистрации", async () => {
      await registerPage.goto();
    });

    await test.step("Проверяем, что открылась страница регистрации", async () => {
      await expect(registerPage.registerButton()).toBeVisible();
    });

    await test.step("Пользователь заполняет имя, email и пароль", async () => {
      await registerPage.fillName(user.name);
      await registerPage.fillEmail(user.email);
      await registerPage.fillPassword(user.password);
    });

    await test.step("Проверяем, что данные регистрации заполнены", async () => {
      await expect(registerPage.nameInput()).toHaveValue(user.name);
      await expect(registerPage.emailInput()).toHaveValue(user.email);
      await expect(registerPage.passwordInput()).toHaveValue(user.password);
    });

    await test.step("Пользователь отправляет форму регистрации", async () => {
      await registerPage.submit();
    });

    await test.step("Проверяем, что пользователь попал на главную страницу", async () => {
      await expect(page).toHaveURL(/\/pomidorqa\/?$/);
    });

    await test.step("Пользователь открывает свой профиль", async () => {
      await profilePage.goto();
    });

    await test.step("Проверяем, что профиль создан с именем из регистрации и часовым поясом Europe/Moscow", async () => {
      await expect(profilePage.nameInput()).toHaveValue(user.name);
      await expect(profilePage.timezoneSelect()).toHaveValue("Europe/Moscow");
    });
  });
});