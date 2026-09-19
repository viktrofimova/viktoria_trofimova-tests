import { type Browser, type BrowserContext } from "@playwright/test";
import { getTomorrowDate, makeUser, registerUserViaApi } from "./user";
import { BookingPage } from "../pages/booking-page";
import { PersonPage } from "../pages/person-page";
import { ProfilePage } from "../pages/profile-page";

export async function preparePublicProfile(browser: Browser, contexts: BrowserContext[]) {
  const runId = Date.now() + Math.floor(Math.random() * 1_000_000);
  const host = makeUser("David", runId);
  const guest = makeUser("Guest", runId);
  const skillTag = `PublicProfile-${runId}`;
  const telegram = `@public_${runId}`;
  const bio = `Публичное описание ${runId}`;
  const slotDate = getTomorrowDate();

  const hostContext = await browser.newContext({ baseURL: "https://aiqa.su" });
  const guestContext = await browser.newContext({ baseURL: "https://aiqa.su" });
  contexts.push(hostContext, guestContext);

  await registerUserViaApi(hostContext.request, host);
  await registerUserViaApi(guestContext.request, guest);

  const hostPage = await hostContext.newPage();
  const guestPage = await guestContext.newPage();
  const hostProfile = new ProfilePage(hostPage);
  const hostBooking = new BookingPage(hostPage);
  const guestBooking = new BookingPage(guestPage);
  const personPage = new PersonPage(guestPage);

  await hostPage.goto("/pomidorqa");
  await guestPage.goto("/pomidorqa");

  return { host, guest, skillTag, telegram, bio, slotDate, hostPage, hostProfile, hostBooking, guestBooking, personPage };
}