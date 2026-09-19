import { type Page } from "@playwright/test";

export class ProfilePage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto("/pomidorqa/profile");
  }

  async reload() {
    await this.page.reload();
  }

  nameInput = () => this.page.getByLabel("Имя");
  telegramInput = () => this.page.getByLabel("Telegram");
  timezoneSelect = () => this.page.getByLabel("Часовой пояс");
  bioInput = () => this.page.getByLabel("О себе");
  saveButton = () => this.page.getByRole("button", { name: "Сохранить" });
  skillInput = () => this.page.locator("#pomidorqa-profile-skill-input");
  skillTypeSelect = () => this.page.locator("#pomidorqa-profile-skill-type");
  addSkillButton = () => this.page.getByRole("button", { name: "Добавить" });
  canHelpSkills = () => this.page.getByTestId("can-help-skills");
  wantToLearnSkills = () => this.page.locator('[data-skills="want_to_learn"]');
  skillChips = () => this.page.locator("[data-skill-tag]");
  skillElement = (tag: string) => this.page.locator(`[data-skill-tag="${tag}"]`);
  skillRemoveButton = (skill: string) => this.page.getByRole("button", { name: `Убрать ${skill}` });

  async changeNameAndSave(newName: string) {
    await this.nameInput().fill(newName);
    await this.save();
  }

  async changeTimezoneAndSave(timezone: string) {
    await this.timezoneSelect().selectOption(timezone);
    await this.save();
  }

  async addTelegramAndSave(telegram: string) {
    await this.telegramInput().fill(telegram);
    await this.save();
  }

  async addBioAndSave(bio: string) {
    await this.bioInput().fill(bio);
    await this.save();
  }

  async fillNameTelegramBioAndSave(name: string, telegram: string, bio: string) {
    await this.nameInput().fill(name);
    await this.telegramInput().fill(telegram);
    await this.bioInput().fill(bio);
    await this.save();
  }

  async clearTelegramAndSave() {
    await this.telegramInput().fill("");
    await this.save();
  }

  async save() {
    const saved = this.page.waitForResponse((response) => response.url().endsWith("/pomidorqa/profile") && response.request().method() === "POST");
    await this.saveButton().click();
    await saved;
  }

  async addSkill(skill: string, type: "can_help" | "want_to_learn" = "can_help") {
    await this.skillInput().fill(skill);
    await this.skillTypeSelect().selectOption(type);
    const added = this.page.waitForResponse((response) => response.url().endsWith("/pomidorqa/profile") && response.request().method() === "POST");
    await this.addSkillButton().click();
    await added;
    await this.skillElement(skill).waitFor({ state: "visible" });
  }

  async submitSkill(skill: string, type: "can_help" | "want_to_learn" = "can_help") {
    await this.skillInput().fill(skill);
    await this.skillTypeSelect().selectOption(type);
    const submitted = this.page.waitForResponse((response) => response.url().endsWith("/pomidorqa/profile") && response.request().method() === "POST");
    await this.addSkillButton().click();
    await submitted;
  }

  async clickAddSkillWithoutInput() {
    await this.addSkillButton().click();
  }

  async removeSkill(skill: string) {
    const removed = this.page.waitForResponse((response) => response.url().endsWith("/pomidorqa/profile") && response.request().method() === "POST");
    await this.skillRemoveButton(skill).click();
    await removed;
  }

  async clearNameAndTrySave() {
    await this.nameInput().fill("");
    await this.saveButton().click();
  }

  async isNameInvalid() {
    return this.nameInput().evaluate((input) => !input.checkValidity());
  }
}