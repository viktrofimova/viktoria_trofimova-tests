import { type Browser, type BrowserContext } from "@playwright/test";

import { makeSearchData, registerUserViaApi } from "./user";

import { BookingPage } from "../pages/booking-page";
import { ProfilePage } from "../pages/profile-page";

export async function prepareSearchFlow(
  browser: Browser,
  contexts: BrowserContext[],
) {
  const { skill, slotDate, host, guest } = makeSearchData();

  const hostContext = await browser.newContext();
  contexts.push(hostContext);

  const guestContext = await browser.newContext();
  contexts.push(guestContext);

  await registerUserViaApi(hostContext.request, host);
  await registerUserViaApi(guestContext.request, guest);

  const hostPage = await hostContext.newPage();
  const guestPage = await guestContext.newPage();

  const hostProfile = new ProfilePage(hostPage);
  const hostBooking = new BookingPage(hostPage);
  const guestBooking = new BookingPage(guestPage);

  return {
    skill,
    slotDate,
    host,
    hostContext,
    guestContext,
    hostPage,
    guestPage,
    hostProfile,
    hostBooking,
    guestBooking,
  };
}