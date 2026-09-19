import { Browser, BrowserContext } from "@playwright/test";
import { prepareSearchFlow } from "./search-flow";
import { makePublicProfileData } from "./user";
import { BookingPage } from "../pages/booking-page";
import { PersonPage } from "../pages/person-page";
import { ProfilePage } from "../pages/profile-page";

export async function preparePublicProfileFlow(browser: Browser, contexts: BrowserContext[]) {
  const search = await prepareSearchFlow(browser, contexts);
  const profileData = makePublicProfileData();
  const slotTime = profileData.slotTime ?? "12:00";

  return {
    ...search,
    wantToLearnSkill: profileData.wantToLearnSkill,
    bio: profileData.bio,
    slotTime,
    personPage: new PersonPage(search.guestPage),
    profilePage: new ProfilePage(search.hostPage),
  };
}