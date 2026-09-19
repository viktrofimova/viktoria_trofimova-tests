import { test, expect, type BrowserContext } from "@playwright/test";
import { deleteUserViaApi } from "../helpers/user";
import { preparePublicProfile } from "../helpers/public-profile";

let accountContexts: BrowserContext[] = [];

test.describe("Публичный профиль", () => {
  test.afterEach(async () => {
    for (const context of accountContexts) {
      await deleteUserViaApi(context.request).catch(() => undefined);
      await context.close();
    }
    accountContexts = [];
  });

  test("Другой участник видит публичный профиль специалиста", async ({ browser }) => {
    const { host, skillTag, telegram, bio, slotDate, hostPage, hostProfile, hostBooking, guestBooking, personPage } =
      await preparePublicProfile(browser, accountContexts);

    await test.step("Специалист открывает свой профиль", async () => {
      await hostProfile.goto();
    });

    await test.step("Проверяем, что открылась страница профиля", async () => {
      await expect(hostProfile.saveButton()).toBeVisible();
    });

    await test.step("Специалист добавляет навык «могу помочь»", async () => {
      await hostProfile.addSkill(skillTag, "can_help");
    });

    await test.step("Проверяем, что навык появился в профиле специалиста", async () => {
      await expect(hostProfile.canHelpSkills()).toContainText(skillTag);
    });

    await test.step("Специалист заполняет Telegram", async () => {
      await hostProfile.telegramInput().fill(telegram);
    });

    await test.step("Проверяем, что Telegram введён", async () => {
      await expect(hostProfile.telegramInput()).toHaveValue(telegram);
    });

    await test.step("Специалист заполняет поле «О себе»", async () => {
      await hostProfile.bioInput().fill(bio);
    });

    await test.step("Проверяем, что описание введено", async () => {
      await expect(hostProfile.bioInput()).toHaveValue(bio);
    });

    await test.step("Специалист сохраняет профиль", async () => {
      await hostProfile.save();
    });

    await test.step("Специалист открывает страницу слотов", async () => {
      await hostPage.goto("/pomidorqa/profile/slots");
    });

    await test.step("Проверяем, что открылась страница слотов", async () => {
      await expect(hostBooking.slotDateInput()).toBeVisible();
    });

    await test.step("Специалист добавляет свободный слот на завтра", async () => {
      await hostBooking.addSlot(slotDate, "15:00");
    });

    await test.step("Проверяем, что свободный слот появился", async () => {
      await expect(hostBooking.freeSlot()).toBeVisible();
    });

    await test.step("Другой участник ищет специалиста по навыку", async () => {
      await guestBooking.searchBySkill(skillTag);
    });

    await test.step("Проверяем, что специалист найден в каталоге", async () => {
      await expect(guestBooking.catalogCard(host.name)).toBeVisible();
    });

    await test.step("Другой участник открывает профиль специалиста", async () => {
      await guestBooking.openHostCard(host.name);
    });

    await test.step("Проверяем, что открылась публичная страница специалиста", async () => {
      await expect(personPage.name()).toHaveText(host.name);
    });

    await test.step("Проверяем, что Telegram виден другому участнику", async () => {
      await expect(personPage.content()).toContainText(telegram);
    });

    await test.step("Проверяем, что описание «О себе» видно другому участнику", async () => {
      await expect(personPage.content()).toContainText(bio);
    });

    await test.step("Проверяем, что навык «могу помочь» виден другому участнику", async () => {
      await expect(personPage.canHelpSection()).toContainText(skillTag);
    });
  });
});