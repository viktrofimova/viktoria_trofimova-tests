import { test, expect, type BrowserContext } from "@playwright/test";
import { deleteUserViaApi } from "../helpers/user";
import { prepareSlotManagement } from "../helpers/slot-management";

let contexts: BrowserContext[] = [];

test.beforeEach(async () => {
  contexts = [];
});

test.afterEach(async () => {
  for (const context of contexts) {
    await deleteUserViaApi(context.request).catch(() => undefined);
    await context.close().catch(() => undefined);
  }

  contexts = [];
});

test("Участник добавляет и удаляет свой свободный слот", async ({ browser }) => {
  const {
    page,
    bookingPage,
    slotDate,
  } = await prepareSlotManagement(browser, contexts);

  const slotTime = "12:00";

  await test.step("Участник открывает страницу своих слотов", async () => {
    await page.goto("/pomidorqa/profile/slots");
  });

  await test.step("Проверяем, что открылась страница слотов", async () => {
    await expect(bookingPage.slotDateInput()).toBeVisible();
  });

  await test.step("Участник добавляет свободный слот на завтра", async () => {
    await bookingPage.addSlot(slotDate, slotTime);
  });

  await test.step("Проверяем, что добавленный свободный слот отображается", async () => {
    await expect(bookingPage.slotCardByTime(slotTime)).toBeVisible();
  });

  await test.step("Участник удаляет свой свободный слот", async () => {
    await bookingPage.deleteSlot(slotTime);
  });

  await test.step("Участник обновляет страницу своих слотов", async () => {
    await page.reload();
  });

  await test.step("Проверяем, что удалённый слот больше не отображается", async () => {
    await expect(bookingPage.slotCardByTime(slotTime)).toHaveCount(0);
  });
});