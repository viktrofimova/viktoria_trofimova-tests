import { type Page } from "@playwright/test";

export class RegisterPage {
  constructor(private readonly page: Page) {}

  nameInput = () => this.page.getByLabel("Имя");
  emailInput = () => this.page.getByLabel("Email");
  passwordInput = () => this.page.getByLabel("Пароль");
  registerButton = () =>
    this.page.getByRole("button", { name: "Зарегистрироваться" });

  async goto() {
    await this.page.goto("/pomidorqa/auth/register");
  }

  async fillName(name: string) {
    await this.nameInput().fill(name);
  }

  async fillEmail(email: string) {
    await this.emailInput().fill(email);
  }

  async fillPassword(password: string) {
    await this.passwordInput().fill(password);
  }

  async submit() {
    await this.registerButton().click();
  }

  async isNameInvalid() {
    return this.nameInput().evaluate((input) => !input.checkValidity());
  }

  async isEmailInvalid() {
    return this.emailInput().evaluate((input) => !input.checkValidity());
  }

  async isPasswordInvalid() {
    return this.passwordInput().evaluate((input) => !input.checkValidity());
  }
}