import { test, expect, type BrowserContext } from "@playwright/test";
import { deleteUserViaApi, makeUser, registerUserViaApi } from "../helpers/user";
import { slotFormValues } from "../helpers/slot-time";
import { BookingPage } from "../pages/booking-page";
import { ProfilePage } from "../pages/profile-page";

let contexts: BrowserContext[] = [];

test.describe("Часовой пояс слотов", () => {
  test.afterEach(async () => {
    for (const context of contexts) {
      await deleteUserViaApi(context.request).catch(() => undefined);
      await context.close().catch(() => undefined);
    }
    contexts = [];
  });

  test("Гость видит время слота в часовом поясе хоста", async ({ browser }) => {
    const runId = Date.now();
    const host = makeUser("tz-host", runId);
    const guest = makeUser("tz-guest", runId);
    const skill = `Timezone-${runId}`;
    const slotTime = "12:00";
    const slot = slotFormValues(24 * 60 * 60 * 1000, "Europe/Moscow");

    const hostContext = await browser.newContext({ timezoneId: "Europe/Moscow" });
    const guestContext = await browser.newContext({ timezoneId: "Asia/Tashkent" });
    contexts.push(hostContext, guestContext);

    await registerUserViaApi(hostContext.request, host);
    await registerUserViaApi(guestContext.request, guest);

    const hostPage = await hostContext.newPage();
    const guestPage = await guestContext.newPage();
    const hostProfile = new ProfilePage(hostPage);
    const hostBooking = new BookingPage(hostPage);
    const guestBooking = new BookingPage(guestPage);

    await test.step("Хост открывает профиль", async () => {
      await hostPage.goto("/pomidorqa/profile");
    });

    await test.step("Хост проверяет часовой пояс профиля", async () => {
      await expect(hostProfile.timezoneSelect()).toHaveValue("Europe/Moscow");
    });

    await test.step("Хост добавляет навык «могу помочь»", async () => {
      await hostProfile.addSkill(skill, "can_help");
    });

    await test.step("Хост добавляет слот на завтра в 12:00", async () => {
      await hostPage.goto("/pomidorqa/profile/slots");
      await hostBooking.addSlot(slot.date, slotTime);
    });

    await test.step("Хост проверяет, что слот создан на 12:00", async () => {
      await expect(hostBooking.slotCardByTime(slotTime)).toBeVisible();
    });

    await test.step("Гость открывает каталог и ищет хоста", async () => {
      await guestPage.goto("/pomidorqa/");
      await guestBooking.searchBySkill(skill);
    });

    await test.step("Гость проверяет, что хост найден", async () => {
      await expect(guestBooking.catalogCard(host.name)).toBeVisible();
    });

    await test.step("Гость открывает карточку хоста", async () => {
      await guestBooking.openHostCard(host.name);
    });

    await test.step("Гость выбирает день и время", async () => {
      await guestBooking.selectDayAndTime(slot.date);
    });

    await test.step("Гость проверяет, что время слота осталось 12:00", async () => {
      await expect(guestBooking.calendarTime().first()).toHaveText(slotTime);
    });

    await test.step("Гость проверяет, что время показано в часовом поясе хоста", async () => {
      await expect(guestBooking.calendarTimezoneHint()).toContainText("Europe/Moscow");
    });

    await test.step("Гость закрывает окно подтверждения", async () => {
      await guestBooking.dismissBooking();
    });
  });
});