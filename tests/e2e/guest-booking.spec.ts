import { test, expect, type BrowserContext } from "@playwright/test";
import { deleteUserViaApi } from "../helpers/user";
import { prepareGuestBooking } from "../helpers/guest-booking";

let contexts: BrowserContext[] = [];
let authenticatedContexts: BrowserContext[] = [];

test.beforeEach(async () => {
  contexts = [];
  authenticatedContexts = [];
});

test.afterEach(async () => {
  for (const context of authenticatedContexts) {
    await deleteUserViaApi(context.request).catch(() => undefined);
  }

  for (const context of contexts) {
    await context.close().catch(() => undefined);
  }

  contexts = [];
  authenticatedContexts = [];
});

test("Гость не может забронировать звонок без авторизации", async ({ browser }) => {
  const {
    skillTag,
    host,
    hostPage,
    hostBooking,
    guestBooking,
    slotDate,
  } = await prepareGuestBooking(browser, contexts, authenticatedContexts);

  await test.step("Гость ищет хоста в каталоге по навыку", async () => {
    await guestBooking.searchBySkill(skillTag);
  });

  await test.step("Проверяем, что хост найден в каталоге", async () => {
    await expect(guestBooking.catalogCard(host.name)).toBeVisible();
  });

  await test.step("Гость открывает карточку хоста", async () => {
    await guestBooking.openHostCard(host.name);
  });

  await test.step("Проверяем, что открылась страница хоста", async () => {
    await expect(guestBooking.personName()).toHaveText(host.name);
  });

  await test.step("Гость выбирает свободный слот", async () => {
    await guestBooking.selectDayAndTime(slotDate);
  });

  await test.step("Проверяем, что открылось окно бронирования", async () => {
    await expect(guestBooking.bookingDialog()).toBeVisible();
  });

  await test.step("Гость пытается подтвердить бронирование", async () => {
    await guestBooking.confirmBooking();
  });

  await test.step("Проверяем, что гость видит требование войти в аккаунт", async () => {
    await expect(guestBooking.bookingGuestError()).toContainText(
      "Нужно войти в аккаунт PomidorQA",
    );
  });

  await test.step("Проверяем, что успешного бронирования нет", async () => {
    await expect(guestBooking.bookingSuccess()).toHaveCount(0);
  });

  await test.step("Хост открывает страницу свободных слотов", async () => {
    await hostPage.goto("/pomidorqa/profile/slots");
  });

  await test.step("Проверяем, что слот остался свободным", async () => {
    await expect(hostBooking.freeSlot()).toBeVisible();
  });
});