import { type Browser, type BrowserContext } from "@playwright/test";
import { getTomorrowDate, makeUser, registerUserViaApi } from "./user";
import { BookingPage } from "../pages/booking-page";

export async function prepareSlotManagement(
  browser: Browser,
  contexts: BrowserContext[],
) {
  const runId = Date.now() + Math.floor(Math.random() * 1_000_000);
  const user = makeUser("slot-management", runId);

  const context = await browser.newContext();
  contexts.push(context);

  await registerUserViaApi(context.request, user);

  const page = await context.newPage();
  const bookingPage = new BookingPage(page);

  return {
    user,
    page,
    bookingPage,
    slotDate: getTomorrowDate(),
  };
}