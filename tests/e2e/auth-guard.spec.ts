import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/login-page";

test.describe("Защита авторизованных разделов", () => {
  test("Неавторизованный пользователь: приватные страницы перенаправляют на страницу авторизации", async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    const privatePaths = [
      "/pomidorqa/profile",
      "/pomidorqa/profile/slots",
      "/pomidorqa/bookings",
    ];

    for (const path of privatePaths) {
      await test.step(`Неавторизованный пользователь открывает ${path}`, async () => {
        await page.goto(path);
      });

      await test.step(`Проверяем, что ${path} перенаправляет на страницу авторизации`, async () => {
        await expect(page).toHaveURL(/\/pomidorqa\/auth\/login\/?$/);
      });

      await test.step("Проверяем, что отображается форма авторизации", async () => {
        await expect(loginPage.loginButton()).toBeVisible();
      });
    }
  });
}); 