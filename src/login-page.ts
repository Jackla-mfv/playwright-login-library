import { expect, Locator, Page } from '@playwright/test'
import { TOTP } from 'totp-generator'
import { URL_LIST } from './url-list'

import { BasePage } from './_base-page'

export class LoginPage extends BasePage {
  protected readonly url = URL_LIST.LOGIN
  private readonly loginButton: Locator

  constructor(public readonly page: Page) {
    super(page)
    // this.loginButton = this.page.getByTestId('login-button')
    this.loginButton = this.page.getByRole('button', { name: 'マネーフォワードIDでログインして続行' })
  }

 async login(email: string, password: string, redirectUrl?: string, totpSecret?: string) {
    if (!totpSecret) {
      await this.loginWithMfid(email, password)
    } else {
      await this.loginWithMfid(email, password, totpSecret)
    }
    await expect(this.page).toHaveURL(new RegExp(`^${process.env.BASE_URL}${redirectUrl || URL_LIST.HOMEPAGE}`), {
      timeout: 5_000,
    })
  }

  private async loginWithMfid(email: string, password: string, totpSecret?: string) {
    if (!totpSecret) {
      throw new Error('TOTP Secret is not defined');
    }

    await this.goto()
    await this.loginButton.click()

    await expect(await this.page).toHaveURL(new RegExp(`^${process.env.MFID_BASE_URL}/sign_in?`))
    await this.page.locator('[name="mfid_user[email]"]').fill(email)
    await this.page.locator('#submitto').click()
    
    await this.page.locator('[name="mfid_user[password]"]').fill(password)
    await this.page.locator('#submitto').click()

    await this.page.waitForLoadState('domcontentloaded')

    await expect(async () => {
      // input and submit TOTP
      const totpTextField = this.page.locator('//*[@id="otp_attempt"]')
      const totpSubmitButton = this.page.locator('//*[@id="submitto"]')
      const { otp } = TOTP.generate(totpSecret, { digits: 6 })
      await totpTextField.fill(otp)
      await totpSubmitButton.click()
    }).toPass({
      timeout: 10 * 1000,
    })
    

    try {
      await expect(this.page).toHaveURL(new RegExp(`^${process.env.MFID_BASE_URL}/passkey_promotion`), {
        timeout: 5 * 1000,
      })
      await this.page.locator('a', { hasText: 'No thanks' }).click()
    } catch (e) {
      // No Passkey Promotion page. So do nothing
    }

    try {
      await expect(this.page).toHaveURL(new RegExp(`^${process.env.BASE_URL}${URL_LIST.MFID_AUTH}`), {
        timeout: 5 * 1000,
      })
    } catch (e) {
      // Already login
    }
  }
}
