import { test, expect, type BrowserContext } from "@playwright/test";
import { deleteUserViaApi } from "../helpers/user";
import { prepareSearchFlow } from "../helpers/search-flow";

let contexts: BrowserContext[] = [];

test.describe("Поиск пользователя в каталоге", () => {
  test.afterEach(async () => {
    try {
      if (contexts[0]) {
        await deleteUserViaApi(contexts[0].request).catch(() => undefined);
      }

      if (contexts[1]) {
        await deleteUserViaApi(contexts[1].request).catch(() => undefined);
      }
    } finally {
      for (const context of contexts) {
        await context.close().catch(() => undefined);
      }

      contexts = [];
    }
  });

  test("Гость находит пользователя в каталоге по уникальному навыку", async ({ browser }) => {
    const { skill, slotDate, host, guest, guestPage, hostPage, hostProfile, guestProfile, hostBooking, guestBooking } = await prepareSearchFlow(browser, contexts);

    await test.step("Хост добавляет уникальный навык", async () => {
      await hostPage.goto("/pomidorqa/profile");
      await hostProfile.addSkill(skill);
    });

    await test.step("Проверяем, что навык добавлен", async () => {
      await expect(hostPage.getByTestId("can-help-skills")).toContainText(skill);
    });

    await test.step("Хост добавляет свободный слот на завтра", async () => {
      await hostPage.goto("/pomidorqa/profile/slots");
      await hostBooking.addSlot(slotDate, "12:00");
    });

    await test.step("Проверяем, что свободный слот создан", async () => {
      await expect(hostBooking.freeSlot()).toBeVisible();
    });

    await test.step("Гость добавляет такой же навык", async () => {
      await guestPage.goto("/pomidorqa/profile");
      await guestProfile.addSkill(skill);
    });

    await test.step("Проверяем, что гость не видит себя в каталоге", async () => {
      await guestPage.goto("/pomidorqa/");
      await guestBooking.searchBySkill(skill);
      await expect(guestBooking.catalogCard(guest.name)).toHaveCount(0);
    });

    await test.step("Проверяем, что в результатах найден хост", async () => {
      const hostCard = guestBooking.catalogCard(host.name);
      await expect(hostCard).toBeVisible();
      await expect(hostCard).toContainText(skill);
    });
  });

  test("Поиск по неизвестному навыку не возвращает пользователей", async ({ browser }) => {
    const { skill, guestPage, guestBooking } = await prepareSearchFlow(browser, contexts);

    await test.step("Гость выполняет поиск по неизвестному навыку", async () => {
      await guestPage.goto("/pomidorqa/");
      await guestBooking.searchBySkill(`Unknown-${skill}`);
    });

    await test.step("Проверяем, что результаты поиска пустые", async () => {
      await expect(guestPage.locator('[data-testid="person-card"]')).toHaveCount(0);
    });
  });
});