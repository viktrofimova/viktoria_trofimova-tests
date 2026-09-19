import { type Page } from "@playwright/test";

export class PersonPage {
  constructor(private readonly page: Page) {}
  personName = () => this.page.getByRole("heading", { level: 1 });
  profileContent = () => this.page.locator("main");
  canHelpSection = () => this.page.getByText(/может помочь с/i).locator("..");
  wantToLearnSection = () => this.page.getByText(/хочет разобрать/i).locator("..");
  aboutMe = (bio: string) => this.profileContent().getByText(bio);
}