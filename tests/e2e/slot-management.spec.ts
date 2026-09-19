import { test, expect, type BrowserContext } from "@playwright/test";
import { prepareSlotManagement } from "../helpers/slot-management";
import { deleteUserViaApi, getYesterdayDate } from "../helpers/user";
import { prepareBookingFlow } from "../helpers/booking-flow";

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
  const { page, bookingPage, slotDate } = await prepareSlotManagement(browser, contexts);
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

test("Нельзя создать слот в прошлом", async ({ browser }) => {
  const { page, bookingPage } = await prepareSlotManagement(browser, contexts);
  const yesterday = getYesterdayDate();

  await test.step("Участник открывает страницу своих слотов", async () => {
    await page.goto("/pomidorqa/profile/slots");
  });

  await test.step("Проверяем, что открылась страница слотов", async () => {
    await expect(bookingPage.slotDateInput()).toBeVisible();
  });

  await test.step("Выбираем вчерашнюю дату", async () => {
    await bookingPage.slotDateInput().fill(yesterday);
  });

  await test.step("Проверяем, что выбрана вчерашняя дата", async () => {
    await expect(bookingPage.slotDateInput()).toHaveValue(yesterday);
  });

  await test.step("Указываем время и пытаемся добавить слот", async () => {
    await bookingPage.slotTimeInput().fill("12:00");
    await bookingPage.slotAddSubmit().click();
  });

  await test.step("Проверяем, что слот в прошлом не создан", async () => {
    await expect(bookingPage.slotCardByTime("12:00")).toHaveCount(0);
  });
});

test("Забронированный слот удалить нельзя", async ({ browser }) => {
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

  await test.step("Проверяем, что открылась страница профиля", async () => {
    await expect(hostProfile.nameInput()).toBeVisible();
  });

  await test.step("Хост добавляет навык", async () => {
    await hostProfile.addSkill(skillTag, "can_help");
  });

  await test.step("Проверяем, что навык появился", async () => {
    await expect(hostProfile.canHelpSkills()).toContainText(skillTag);
  });

  await test.step("Хост открывает страницу слотов", async () => {
    await hostPage.goto("/pomidorqa/profile/slots");
  });

  await test.step("Хост добавляет свободный слот", async () => {
    await hostBooking.addSlot(slotDate, "11:00");
  });

  await test.step("Проверяем, что у свободного слота есть кнопка удаления", async () => {
    await expect(hostBooking.slotDeleteButton("11:00")).toBeVisible();
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

  await test.step("Проверяем, что открылась карточка хоста", async () => {
    await expect(guestBooking.personName()).toHaveText(host.name);
  });

  await test.step("Гость выбирает свободный слот", async () => {
    await guestBooking.selectDayAndTime(slotDate);
  });

  await test.step("Проверяем, что открылось окно подтверждения", async () => {
    await expect(guestBooking.bookingDialog()).toBeVisible();
  });

  await test.step("Гость подтверждает бронирование", async () => {
    await guestBooking.confirmBooking();
  });

  await test.step("Проверяем, что бронирование создано", async () => {
    await expect(guestBooking.bookingSuccess()).toBeVisible();
  });

  await test.step("Хост обновляет страницу слотов", async () => {
    await hostPage.reload();
  });

  await test.step("Проверяем, что слот стал забронированным", async () => {
    await expect(hostBooking.slotCardByTime("11:00")).toHaveAttribute("data-slot-status", "booked");
  });

  await test.step("Проверяем, что у забронированного слота нет кнопки удаления", async () => {
    await expect(hostBooking.slotDeleteButton("11:00")).toHaveCount(0);
  });
}); 