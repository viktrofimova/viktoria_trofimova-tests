import { type Browser, type BrowserContext } from "@playwright/test";
import {
  getTomorrowDate,
  makeBookingFlowData,
  registerUserViaApi,
} from "./user";
import { BookingPage } from "../pages/booking-page";
import { ProfilePage } from "../pages/profile-page";

export async function prepareGuestBooking(
  browser: Browser,
  contexts: BrowserContext[],
  authenticatedContexts: BrowserContext[],
) {
  const { skillTag, host } = makeBookingFlowData();

  const hostContext = await browser.newContext();
  const guestContext = await browser.newContext();

  contexts.push(hostContext, guestContext);
  authenticatedContexts.push(hostContext);

  await registerUserViaApi(hostContext.request, host);

  const hostPage = await hostContext.newPage();
  const guestPage = await guestContext.newPage();

  const hostProfile = new ProfilePage(hostPage);
  const hostBooking = new BookingPage(hostPage);
  const guestBooking = new BookingPage(guestPage);

  const slotDate = getTomorrowDate();

  await hostPage.goto("/pomidorqa/profile");
  await hostProfile.addSkill(skillTag, "can_help");

  await hostPage.goto("/pomidorqa/profile/slots");
  await hostBooking.addSlot(slotDate, "12:00");

  await guestPage.goto("/pomidorqa");

  return {
    skillTag,
    host,
    hostPage,
    hostBooking,
    guestPage,
    guestBooking,
    slotDate,
  };
}