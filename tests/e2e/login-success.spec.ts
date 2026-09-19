import { test, expect } from "@playwright/test";
import { deleteUserViaApi } from "../helpers/user";
import { prepareLoginSuccess } from "../helpers/login-success";
import { AppHeader } from "../pages/app-header";
import { LoginPage } from "../pages/login-page";

test.describe("Авторизация", () => {
  let user: Awaited<ReturnType<typeof prepareLoginSuccess>>;
  let loginPage: LoginPage;
  let appHeader: AppHeader;

  test.beforeEach(async ({ page }) => {
    user = await prepareLoginSuccess(page.context().request);
    loginPage = new LoginPage(page);
    appHeader = new AppHeader(page);
  });

  test.afterEach(async ({ page }) => {
    await deleteUserViaApi(page.context().request).catch(() => undefined);
  });

  test("Успешный вход сохраняет сессию, а выход завершает её", async ({
    page,
  }) => {
    await test.step("Пользователь открывает страницу авторизации", async () => {
      await loginPage.goto();
    });

    await test.step("Проверяем, что открылась страница авторизации", async () => {
      await expect(loginPage.loginButton()).toBeVisible();
    });

    await test.step("Пользователь вводит корректный email и пароль", async () => {
      await loginPage.login(user.email, user.password);
    });

    await test.step("Проверяем, что пользователь вошёл в приложение", async () => {
      await expect(page).toHaveURL(/\/pomidorqa\/?$/);
    });

    await test.step("Пользователь обновляет страницу", async () => {
      await page.reload();
    });

    await test.step("Проверяем, что сессия сохранилась после обновления страницы", async () => {
      await expect(appHeader.logoutButton()).toBeVisible();
    });

    await test.step("Пользователь выходит из аккаунта", async () => {
      await appHeader.logout();
    });

    await test.step("Проверяем, что пользователь вышел из аккаунта", async () => {
      await expect(appHeader.logoutButton()).toHaveCount(0);
    });

    await test.step("Пользователь открывает приватную страницу после выхода", async () => {
      await page.goto("/pomidorqa/profile");
    });

    await test.step("Проверяем, что после выхода доступ к профилю закрыт", async () => {
      await expect(page).toHaveURL(/\/pomidorqa\/auth\/login\/?$/);
    });
  });
});