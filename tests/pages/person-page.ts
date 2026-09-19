import { type Page } from "@playwright/test";

export class PersonPage {
  constructor(private readonly page: Page) {}

  content = () => this.page.locator("main");
  name = () => this.page.getByRole("heading", { level: 1 });
  canHelpSection = () =>
    this.page.getByText(/может помочь с/i).locator("..");
  wantToLearnSection = () =>
    this.page.getByText(/хочет разобрать/i).locator("..");
}