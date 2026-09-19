import { test, expect } from "@playwright/test";
import {
  deleteUserViaApi,
  makeUser,
  registerUserViaApi,
} from "../helpers/user";
import { ProfilePage } from "../pages/profile-page";

test.describe("Обязательные поля профиля", () => {
  let profilePage: ProfilePage;

  test.beforeEach(async ({ page }) => {
    const user = makeUser("profile-required", Date.now());
    profilePage = new ProfilePage(page);

    await registerUserViaApi(page.context().request, user);
    await profilePage.goto();
  });

  test.afterEach(async ({ page }) => {
    await deleteUserViaApi(page.context().request).catch(() => undefined);
  });

  test("Имя: нельзя сохранить пустое значение", async () => {
    await test.step("Пользователь очищает поле «Имя» и пытается сохранить профиль", async () => {
      await profilePage.clearNameAndTrySave();
    });

    await test.step("Проверяем, что поле «Имя» не проходит валидацию", async () => {
      expect(await profilePage.isNameInvalid()).toBe(true);
    });
  });
});