import { type Page } from "@playwright/test";

export class AppHeader {
  constructor(private readonly page: Page) {}

  logoutButton = () =>
    this.page.getByRole("button", { name: "Выйти" });

  async logout() {
    await this.logoutButton().click();
  }
}