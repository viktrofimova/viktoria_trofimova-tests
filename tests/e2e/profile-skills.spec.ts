import { test, expect } from "@playwright/test";
import { deleteUserViaApi, makeSkillData, makeUser, registerUserViaApi } from "../helpers/user";
import { ProfilePage } from "../pages/profile-page";

test.describe("Навыки профиля", () => {
  let profilePage: ProfilePage;

  test.beforeEach(async ({ page }) => {
    const user = makeUser("David", Date.now() + Math.floor(Math.random() * 1_000_000));
    profilePage = new ProfilePage(page);
    await registerUserViaApi(page.context().request, user);
    await profilePage.goto();
  });

  test.afterEach(async ({ page }) => {
    await deleteUserViaApi(page.context().request).catch(() => undefined);
  });

  test("Один и тот же навык нельзя добавить повторно", async ({ page }) => {
    const { canHelpTag } = makeSkillData();

    await test.step("Добавляем навык «могу помочь»", async () => {
      await profilePage.addSkill(canHelpTag, "can_help");
    });

    await test.step("Проверяем, что навык появился в блоке «могу помочь»", async () => {
      await expect(profilePage.canHelpSkills()).toContainText(canHelpTag);
    });

    await test.step("Повторно добавляем тот же навык", async () => {
      await profilePage.submitSkill(canHelpTag, "can_help");
    });

    await test.step("Обновляем страницу профиля", async () => {
      await page.reload();
    });

    await test.step("Проверяем, что навык остался в единственном экземпляре", async () => {
      await expect(profilePage.skillElement(canHelpTag)).toHaveCount(1);
    });
  });

  test("Один навык может иметь разные типы", async () => {
    const { canHelpTag } = makeSkillData();

    await test.step("Добавляем навык «могу помочь»", async () => {
      await profilePage.addSkill(canHelpTag, "can_help");
    });

    await test.step("Проверяем, что навык появился в блоке «могу помочь»", async () => {
      await expect(profilePage.canHelpSkills()).toContainText(canHelpTag);
    });

    await test.step("Добавляем тот же навык «хочу разобрать»", async () => {
      await profilePage.submitSkill(canHelpTag, "want_to_learn");
    });

    await test.step("Проверяем, что навык появился в блоке «хочу разобрать»", async () => {
      await expect(profilePage.wantToLearnSkills()).toContainText(canHelpTag);
    });

    await test.step("Проверяем, что навык также остался в блоке «могу помочь»", async () => {
      await expect(profilePage.canHelpSkills()).toContainText(canHelpTag);
    });

    await test.step("Проверяем, что в профиле две записи навыка", async () => {
      await expect(profilePage.skillChips()).toHaveCount(2);
    });
  });

  test("Навык можно удалить из профиля", async () => {
    const { canHelpTag } = makeSkillData();
  
    await test.step("Добавляем навык «могу помочь»", async () => {
      await profilePage.addSkill(canHelpTag, "can_help");
    });
  
    await test.step("Проверяем, что навык появился в профиле", async () => {
      await expect(profilePage.skillElement(canHelpTag)).toBeVisible();
    });
  
    await test.step("Удаляем навык", async () => {
      await profilePage.removeSkill(canHelpTag);
    });
  
    await test.step("Проверяем, что навык удалён из профиля", async () => {
      await expect(profilePage.skillElement(canHelpTag)).toHaveCount(0);
    });
  });
});