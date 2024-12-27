import { Page } from '@playwright/test'

export class BasePage {
  protected readonly url?: string

  constructor(public readonly page: Page) {}

  public async goto() {
    if (this.url) {
      await this.page.goto(this.url)
    } else {
      throw new Error('URL is not defined')
    }
  }
}