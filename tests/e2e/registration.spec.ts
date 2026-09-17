import { test, expect } from "@playwright/test";
import { deleteUserViaApi, makeUser, registerUser } from "../helpers/user";

test.describe("Регистрация", () => {
  test.afterEach(async ({ page }) => {
    await deleteUserViaApi(page.context().request);
  });

  test("Регистрация: пользователь создаёт аккаунт через UI", async ({ page }) => {
    const user = makeUser("registration-ui", Date.now());

    await test.step("Пользователь регистрируется через UI", async () => {
      await registerUser(page, user);
    });

    await test.step("Проверяем, что пользователь успешно зарегистрировался и попал на главную страницу", async () => {
      await expect(page).toHaveURL(/\/pomidorqa\/?$/);
    });
  });
});