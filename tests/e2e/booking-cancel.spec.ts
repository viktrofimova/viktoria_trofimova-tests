import { test, expect, type BrowserContext } from "@playwright/test";
import { deleteUserViaApi } from "../helpers/user";
import { prepareBookingFlow } from "../helpers/booking-flow";

let contexts: BrowserContext[] = [];

test.describe("Отмена встречи", () => {
  test.afterEach(async () => {
    try {
      for (const context of contexts) {
        await deleteUserViaApi(context.request).catch(() => undefined);
      }
    } finally {
      for (const context of contexts) {
        await context.close().catch(() => undefined);
      }

      contexts = [];
    }
  });

  test("Гость отменяет забронированную встречу", async ({ browser }) => {
    test.setTimeout(60_000);

    const {
      skillTag,
      host,
      hostPage,
      guestPage,
      hostProfile,
      hostBooking,
      guestBooking,
      slotDate,
    } = await prepareBookingFlow(browser, contexts);

    await test.step("Хост открывает страницу профиля", async () => {
      await hostPage.goto("/pomidorqa/profile");
    });

    await test.step("Проверяем, что открылась страница профиля хоста", async () => {
      await expect(hostProfile.nameInput()).toBeVisible();
    });

    await test.step("Хост добавляет навык «могу помочь»", async () => {
      await hostProfile.addSkill(skillTag, "can_help");
    });

    await test.step("Проверяем, что навык появился у хоста", async () => {
      await expect(hostProfile.canHelpSkills()).toContainText(skillTag);
    });

    await test.step("Хост открывает страницу свободных слотов", async () => {
      await hostPage.goto("/pomidorqa/profile/slots");
    });

    await test.step("Проверяем, что открылась страница слотов", async () => {
      await expect(hostBooking.slotDateInput()).toBeVisible();
    });

    await test.step("Хост добавляет свободный слот на завтра", async () => {
      await hostBooking.addSlot(slotDate, "12:00");
    });

    await test.step("Проверяем, что свободный слот появился", async () => {
      await expect(hostBooking.freeSlot()).toBeVisible();
    });

    await test.step("Гость открывает каталог", async () => {
      await guestPage.goto("/pomidorqa/");
    });

    await test.step("Гость ищет хоста по навыку", async () => {
      await guestBooking.searchBySkill(skillTag);
    });

    await test.step("Проверяем, что хост найден", async () => {
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

    await test.step("Проверяем, что открылось окно подтверждения бронирования", async () => {
      await expect(guestBooking.bookingDialog()).toBeVisible();
    });

    await test.step("Гость подтверждает бронирование", async () => {
      await guestBooking.confirmBooking();
    });

    await test.step("Проверяем, что бронирование создано", async () => {
      await expect(guestBooking.bookingSuccess()).toBeVisible();
    });

    await test.step("Гость открывает «Мои встречи»", async () => {
      await guestBooking.goToBookings();
    });

    await test.step("Проверяем, что у гостя появилась ближайшая встреча", async () => {
      await expect(guestBooking.upcomingBookingCard(host.name)).toBeVisible();
    });

    await test.step("Гость отменяет встречу", async () => {
      await guestBooking.cancelBooking(host.name);
    });

    await test.step("Проверяем, что отменённая встреча появилась в списке прошедших и отменённых", async () => {
      await expect(guestBooking.pastBookingCard(host.name)).toBeVisible();
    });
  });

  test("Хост отменяет забронированную встречу", async ({ browser }) => {
    test.setTimeout(60_000);

    const {
      skillTag,
      host,
      guest,
      hostPage,
      guestPage,
      hostProfile,
      hostBooking,
      guestBooking,
      slotDate,
    } = await prepareBookingFlow(browser, contexts);

    await test.step("Хост открывает страницу профиля", async () => {
      await hostPage.goto("/pomidorqa/profile");
    });

    await test.step("Проверяем, что открылась страница профиля хоста", async () => {
      await expect(hostProfile.nameInput()).toBeVisible();
    });

    await test.step("Хост добавляет навык «могу помочь»", async () => {
      await hostProfile.addSkill(skillTag, "can_help");
    });

    await test.step("Проверяем, что навык появился у хоста", async () => {
      await expect(hostProfile.canHelpSkills()).toContainText(skillTag);
    });

    await test.step("Хост открывает страницу свободных слотов", async () => {
      await hostPage.goto("/pomidorqa/profile/slots");
    });

    await test.step("Хост добавляет свободный слот на завтра", async () => {
      await hostBooking.addSlot(slotDate, "12:00");
    });

    await test.step("Проверяем, что свободный слот появился", async () => {
      await expect(hostBooking.freeSlot()).toBeVisible();
    });

    await test.step("Гость открывает каталог", async () => {
      await guestPage.goto("/pomidorqa/");
    });

    await test.step("Гость ищет хоста по навыку", async () => {
      await guestBooking.searchBySkill(skillTag);
    });

    await test.step("Проверяем, что хост найден", async () => {
      await expect(guestBooking.catalogCard(host.name)).toBeVisible();
    });

    await test.step("Гость открывает карточку хоста", async () => {
      await guestBooking.openHostCard(host.name);
    });

    await test.step("Гость выбирает свободный слот", async () => {
      await guestBooking.selectDayAndTime(slotDate);
    });

    await test.step("Гость подтверждает бронирование", async () => {
      await guestBooking.confirmBooking();
    });

    await test.step("Проверяем, что бронирование создано", async () => {
      await expect(guestBooking.bookingSuccess()).toBeVisible();
    });

    await test.step("Хост открывает «Мои встречи»", async () => {
      await hostBooking.goToBookings();
    });

    await test.step("Проверяем, что у хоста появилась встреча с гостем", async () => {
      await expect(hostBooking.upcomingBookingCard(guest.name)).toBeVisible();
    });

    await test.step("Хост отменяет встречу", async () => {
      await hostBooking.cancelBooking(guest.name);
    });

    await test.step("Хост обновляет «Мои встречи»", async () => {
      await hostBooking.goToBookings();
    });

    await test.step("Проверяем, что отменённая встреча появилась у хоста в списке прошедших и отменённых", async () => {
      await expect(hostBooking.pastBookingCard(guest.name)).toBeVisible();
    });
  });
});