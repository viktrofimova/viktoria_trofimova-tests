import { test, expect } from "@playwright/test";
import { deleteUserViaApi } from "../helpers/user";
import { prepareLoginSuccess } from "../helpers/login-success";
import { LoginPage } from "../pages/login-page";

test.describe("Авторизация", () => {
  let user: Awaited<ReturnType<typeof prepareLoginSuccess>>;

  test.beforeEach(async ({ page }) => {
    user = await prepareLoginSuccess(page.context().request);
  });

  test.afterEach(async ({ page }) => {
    await deleteUserViaApi(page.context().request);
  });

  test("Успешный вход: пользователь входит с корректными данными", async ({ page,
    }) => {
    const loginPage = new LoginPage(page);

    await test.step("Пользователь открывает страницу авторизации", async () => {
      await page.goto("/pomidorqa/auth/login");
    });
 
    await test.step("Проверяем, что открылась страница авторизации", async () => {
      await expect(loginPage.loginButton()).toBeVisible();
    });

    await test.step("Пользователь вводит корректный email и пароль", async () => {
      await loginPage.login(user.email, user.password);
    });

    await test.step("Проверяем, что пользователь успешно вошёл в приложение", async () => {
        await expect(page).toHaveURL(/\/pomidorqa\/?$/);
      },
    );
  });
});

