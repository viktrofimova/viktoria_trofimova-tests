import { test, expect } from "@playwright/test";
import {
  deleteUserViaApi,
  makeProfileData,
  makeSkillData,
  makeUser,
  registerUserViaApi,
} from "../helpers/user";
import { ProfilePage } from "../pages/profile-page";

const ROUTES = {
  profile: "/pomidorqa/profile",
};

test.describe("Профиль: действия с полями", () => {
  let profilePage: ProfilePage;
  let user: ReturnType<typeof makeUser>;

  test.beforeEach(async ({ page }) => {
    user = makeUser("David", Date.now() + Math.floor(Math.random() * 1_000_000));
    profilePage = new ProfilePage(page);

    await registerUserViaApi(page.context().request, user);
    await page.goto(ROUTES.profile);
  });

  test.afterEach(async ({ page }) => {
    await deleteUserViaApi(page.context().request).catch(() => undefined);
  });

  test("Имя: заполняем поле и сохраняем", async ({ page }) => {
    const { testName: newName } = makeProfileData();

    await test.step("Заполняем новое имя", async () => {
      await profilePage.nameInput().fill(newName);
    });

    await test.step("Проверяем, что новое имя введено", async () => {
      await expect(profilePage.nameInput()).toHaveValue(newName);
    });

    await test.step("Сохраняем профиль", async () => {
      await profilePage.save();
    });

    await test.step("Обновляем страницу профиля", async () => {
      await page.reload();
    });

    await test.step("Проверяем, что имя сохранилось на сервере", async () => {
      await expect(profilePage.nameInput()).toHaveValue(newName);
    });
  });

  test("Часовой пояс: выбираем из списка", async ({ page }) => {
    const { timezone } = makeProfileData();

    await test.step("Выбираем часовой пояс", async () => {
      await profilePage.timezoneSelect().selectOption(timezone);
    });

    await test.step("Проверяем, что выбран нужный часовой пояс", async () => {
      await expect(profilePage.timezoneSelect()).toHaveValue(timezone);
    });

    await test.step("Сохраняем профиль", async () => {
      await profilePage.save();
    });

    await test.step("Обновляем страницу профиля", async () => {
      await page.reload();
    });

    await test.step("Проверяем, что часовой пояс сохранился на сервере", async () => {
      await expect(profilePage.timezoneSelect()).toHaveValue(timezone);
    });
  });

  test("Telegram: заполняем пустое поле", async ({ page }) => {
    const { testTelegram: telegram } = makeProfileData();

    await test.step("Заполняем Telegram", async () => {
      await profilePage.telegramInput().fill(telegram);
    });

    await test.step("Проверяем, что Telegram введён", async () => {
      await expect(profilePage.telegramInput()).toHaveValue(telegram);
    });

    await test.step("Сохраняем профиль", async () => {
      await profilePage.save();
    });

    await test.step("Обновляем страницу профиля", async () => {
      await page.reload();
    });

    await test.step("Проверяем, что Telegram сохранился на сервере", async () => {
      await expect(profilePage.telegramInput()).toHaveValue(telegram);
    });
  });

  test("Telegram: можно сохранить пустое значение", async ({ page }) => {
    const { testTelegram: telegram } = makeProfileData();

    await test.step("Заполняем Telegram", async () => {
      await profilePage.telegramInput().fill(telegram);
    });

    await test.step("Проверяем, что Telegram введён", async () => {
      await expect(profilePage.telegramInput()).toHaveValue(telegram);
    });

    await test.step("Сохраняем Telegram", async () => {
      await profilePage.save();
    });

    await test.step("Проверяем, что Telegram сохранился", async () => {
      await page.reload();
      await expect(profilePage.telegramInput()).toHaveValue(telegram);
    });

    await test.step("Очищаем Telegram", async () => {
      await profilePage.telegramInput().fill("");
    });

    await test.step("Проверяем, что поле Telegram пустое", async () => {
      await expect(profilePage.telegramInput()).toHaveValue("");
    });

    await test.step("Сохраняем пустой Telegram", async () => {
      await profilePage.save();
    });

    await test.step("Обновляем страницу профиля", async () => {
      await page.reload();
    });

    await test.step("Проверяем, что пустой Telegram сохранился на сервере", async () => {
      await expect(profilePage.telegramInput()).toHaveValue("");
    });
  });

  test("О себе: заполняем многострочное поле", async ({ page }) => {
    const { testBio: bio } = makeProfileData();

    await test.step("Заполняем поле «О себе»", async () => {
      await profilePage.bioInput().fill(bio);
    });

    await test.step("Проверяем, что текст «О себе» введён", async () => {
      await expect(profilePage.bioInput()).toHaveValue(bio);
    });

    await test.step("Сохраняем профиль", async () => {
      await profilePage.save();
    });

    await test.step("Обновляем страницу профиля", async () => {
      await page.reload();
    });

    await test.step("Проверяем, что текст «О себе» сохранился на сервере", async () => {
      await expect(profilePage.bioInput()).toHaveValue(bio);
    });
  });

  test("О себе: можно сохранить пустое значение", async ({ page }) => {
    await test.step("Оставляем поле «О себе» пустым", async () => {
      await profilePage.bioInput().fill("");
    });
  
    await test.step("Проверяем, что поле «О себе» пустое", async () => {
      await expect(profilePage.bioInput()).toHaveValue("");
    });
  
    await test.step("Сохраняем профиль", async () => {
      await profilePage.save();
    });
  
    await test.step("Обновляем страницу профиля", async () => {
      await page.reload();
    });
  
    await test.step("Проверяем, что пустое поле «О себе» сохранилось", async () => {
      await expect(profilePage.bioInput()).toHaveValue("");
    });
  });

  test("Навык: заполняем, выбираем тип и добавляем", async () => {
    const { skillTag } = makeProfileData();

    await test.step("Заполняем название навыка", async () => {
      await profilePage.skillInput().fill(skillTag);
    });

    await test.step("Проверяем, что название навыка введено", async () => {
      await expect(profilePage.skillInput()).toHaveValue(skillTag);
    });

    await test.step("Выбираем тип «могу помочь»", async () => {
      await profilePage.skillTypeSelect().selectOption("can_help");
    });

    await test.step("Проверяем, что выбран тип «могу помочь»", async () => {
      await expect(profilePage.skillTypeSelect()).toHaveValue("can_help");
    });

    await test.step("Добавляем навык", async () => {
      await profilePage.addSkillButton().click();
    });

    await test.step("Проверяем, что навык появился в профиле", async () => {
      await expect(profilePage.skillElement(skillTag)).toBeVisible();
    });
  });

  test("Негатив: пустой навык не добавляется", async () => {
    await test.step("Оставляем поле навыка пустым", async () => {
      await profilePage.skillInput().fill("");
    });

    await test.step("Проверяем, что поле навыка пустое", async () => {
      await expect(profilePage.skillInput()).toHaveValue("");
    });

    await test.step("Пытаемся добавить пустой навык", async () => {
      await profilePage.addSkillButton().click();
    });

    await test.step("Проверяем, что навык не появился", async () => {
      await expect(profilePage.skillChips()).toHaveCount(0);
      await expect(profilePage.canHelpSkills()).not.toBeVisible();
    });
  });

  test("Негатив: навык «хочу разобрать» не попадает в блок «могу помочь»", async () => {
    const { canHelpTag, wantToLearnTag } = makeSkillData();
  
    await test.step("Заполняем первый навык", async () => {
      await profilePage.skillInput().fill(canHelpTag);
    });
  
    await test.step("Проверяем, что первый навык введён", async () => {
      await expect(profilePage.skillInput()).toHaveValue(canHelpTag);
    });
  
    await test.step("Выбираем тип «могу помочь» для первого навыка", async () => {
      await profilePage.skillTypeSelect().selectOption("can_help");
    });
  
    await test.step("Проверяем выбранный тип первого навыка", async () => {
      await expect(profilePage.skillTypeSelect()).toHaveValue("can_help");
    });
  
    await test.step("Добавляем первый навык", async () => {
      await profilePage.addSkillButton().click();
    });
  
    await test.step("Проверяем, что первый навык появился в профиле", async () => {
      await expect(profilePage.skillElement(canHelpTag)).toBeVisible();
    });
  
    await test.step("Заполняем второй навык", async () => {
      await profilePage.skillInput().fill(wantToLearnTag);
    });
  
    await test.step("Проверяем, что второй навык введён", async () => {
      await expect(profilePage.skillInput()).toHaveValue(wantToLearnTag);
    });
  
    await test.step("Выбираем тип «хочу разобрать» для второго навыка", async () => {
      await profilePage.skillTypeSelect().selectOption("want_to_learn");
    });
  
    await test.step("Проверяем выбранный тип второго навыка", async () => {
      await expect(profilePage.skillTypeSelect()).toHaveValue("want_to_learn");
    });
  
    await test.step("Добавляем второй навык", async () => {
      await profilePage.addSkillButton().click();
    });
  
    await test.step("Проверяем, что второй навык появился в профиле", async () => {
      await expect(profilePage.skillElement(wantToLearnTag)).toBeVisible();
    });
  
    await test.step("Проверяем, что в профиле два навыка", async () => {
      await expect(profilePage.skillChips()).toHaveCount(2);
    });
  
    await test.step("Проверяем, что первый навык находится в блоке «могу помочь»", async () => {
      await expect(profilePage.canHelpSkills()).toContainText(canHelpTag);
    });
  
    await test.step("Проверяем, что второй навык не находится в блоке «могу помочь»", async () => {
      await expect(profilePage.canHelpSkills()).not.toContainText(wantToLearnTag);
    });
  });

  test("Форма профиля: три поля сохраняются за один раз", async ({ page }) => {
    const { name, telegram, bio } = makeProfileData();

    await test.step("Заполняем имя", async () => {
      await profilePage.nameInput().fill(name);
    });

    await test.step("Проверяем, что имя введено", async () => {
      await expect(profilePage.nameInput()).toHaveValue(name);
    });

    await test.step("Заполняем Telegram", async () => {
      await profilePage.telegramInput().fill(telegram);
    });

    await test.step("Проверяем, что Telegram введён", async () => {
      await expect(profilePage.telegramInput()).toHaveValue(telegram);
    });

    await test.step("Заполняем поле «О себе»", async () => {
      await profilePage.bioInput().fill(bio);
    });

    await test.step("Проверяем, что текст «О себе» введён", async () => {
      await expect(profilePage.bioInput()).toHaveValue(bio);
    });

    await test.step("Сохраняем профиль", async () => {
      await profilePage.save();
    });

    await test.step("Обновляем страницу профиля", async () => {
      await page.reload();
    });

    await test.step("Проверяем, что имя сохранилось", async () => {
      await expect(profilePage.nameInput()).toHaveValue(name);
    });

    await test.step("Проверяем, что Telegram сохранился", async () => {
      await expect(profilePage.telegramInput()).toHaveValue(telegram);
    });

    await test.step("Проверяем, что текст «О себе» сохранился", async () => {
      await expect(profilePage.bioInput()).toHaveValue(bio);
    });
  });
});