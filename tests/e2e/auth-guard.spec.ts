import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/login-page";

test.describe("Защита авторизованных разделов", () => {
  test("Неавторизованный пользователь: доступ к профилю перенаправляет на страницу авторизации", async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);

    await test.step("Неавторизованный пользователь открывает страницу профиля", async () => {
      await page.goto("/pomidorqa/profile");
    });

    await test.step("Проверяем, что пользователь перенаправлен на страницу авторизации", async () => {
      await expect(page).toHaveURL(/\/pomidorqa\/auth\/login\/?$/);
    });

    await test.step("Проверяем, что отображается форма авторизации", async () => {
      await expect(loginPage.loginButton()).toBeVisible();
    });
  });
});