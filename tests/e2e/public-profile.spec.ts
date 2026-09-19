import { test, expect, type BrowserContext } from "@playwright/test";
import { deleteUserViaApi } from "../helpers/user";
import { preparePublicProfileFlow } from "../helpers/public-profile-flow";

let contexts: BrowserContext[] = [];

test.afterEach(async () => {
  for (const context of contexts) {
    await deleteUserViaApi(context.request).catch(() => undefined);
    await context.close().catch(() => undefined);
  }
  contexts = [];
});

test("Публичный профиль показывает имя, описание, оба типа навыков и свободный слот", async ({ browser }) => {
  test.setTimeout(60_000);

  const flow = await preparePublicProfileFlow(browser, contexts);

  await test.step("Хост открывает профиль", async () => {
    await flow.profilePage.goto();
  });
  await test.step("Хост добавляет навык «могу помочь»", async () => {
    await flow.profilePage.addSkill(flow.skill, "can_help");
  });
  await test.step("Проверяем, что навык «могу помочь» появился", async () => {
    await expect(flow.profilePage.canHelpSkills()).toContainText(flow.skill);
  });
  await test.step("Хост добавляет навык «хочу разобрать»", async () => {
    await flow.profilePage.addSkill(flow.wantToLearnSkill, "want_to_learn");
  });
  await test.step("Проверяем, что навык «хочу разобрать» появился", async () => {
    await expect(flow.profilePage.skillElement(flow.wantToLearnSkill)).toBeVisible();
  });
  await test.step("Хост заполняет имя и описание профиля и сохраняет", async () => {
    await flow.profilePage.fillNameTelegramBioAndSave(flow.host.name, "", flow.bio);
  });
  await test.step("Хост добавляет свободный слот на завтра", async () => {
    await flow.hostPage.goto("/pomidorqa/profile/slots");
    await flow.hostBooking.addSlot(flow.slotDate, flow.slotTime);
  });
  await test.step("Хост проверяет, что свободный слот появился", async () => {
    await expect(flow.hostBooking.slotCardByTime(flow.slotTime)).toBeVisible();
  });
  await test.step("Гость открывает каталог", async () => {
    await flow.guestPage.goto("/pomidorqa/");
  });
  await test.step("Гость ищет хоста по навыку", async () => {
    await flow.guestBooking.searchBySkill(flow.skill);
  });
  await test.step("Проверяем, что хост найден в каталоге", async () => {
    await expect(flow.guestBooking.catalogCard(flow.host.name)).toBeVisible();
  });
  await test.step("Гость открывает карточку хоста", async () => {
    await flow.guestBooking.openHostCard(flow.host.name);
  });
  await test.step("Проверяем имя на публичном профиле", async () => {
    await expect(flow.personPage.personName()).toHaveText(flow.host.name);
  });
  await test.step("Проверяем описание профиля", async () => {
    await expect(flow.personPage.aboutMe(flow.bio)).toBeVisible();
  });
  await test.step("Проверяем навык «могу помочь» на публичном профиле", async () => {
    await expect(flow.personPage.canHelpSection()).toContainText(flow.skill);
  });
  await test.step("Проверяем навык «хочу разобрать» на публичном профиле", async () => {
    await expect(flow.personPage.wantToLearnSection()).toContainText(flow.wantToLearnSkill);
  });
  await test.step("Проверяем свободный слот на завтра", async () => {
    await expect(flow.guestBooking.bookingDay(flow.slotDate)).toBeVisible();
  });
  await test.step("Проверяем время свободного слота", async () => {
    await expect(flow.guestBooking.calendarTime().first()).toHaveText(flow.slotTime);
  });
});