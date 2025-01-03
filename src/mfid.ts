import { expect, Page } from "@playwright/test";
import { TOTP } from "totp-generator";
import { Env } from "@/src/env";
import * as fs from "fs";

export class MFID {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * login through MFID using UI. it stores storage state and cookies. By default, it stores in playwright/.auth/state.json and playwright/.auth/cookie.json.
   * This method assumes mfid login page is already opened.
   * This method assumes successful login pattern only for brevity sake. You better to add other patterns using API instead of UI.
   * It saves storage state and cookies. StorageState for UI, cookies for API testing.
   * @param email email address
   * @param password password
   * @param totpSecret TOTP secret
   * @param redirectUrl redirect URL after login
   * @param storageStatePath storage state path
   * @param cookieFilePath cookie file path
   */
  public async login({
    email,
    password,
    totpSecret,
    redirectUrl,
    stateStoragePath: storageStatePath = "playwright/.auth/state.json",
    cookieFilePath = "playwright/.auth/cookie.json",
  }: {
    email: string;
    password: string;
    totpSecret?: string;
    stateStoragePath?: string;
    redirectUrl?: string;
    cookieFilePath?: string;
  }) {
    // mfid login
    const emailAddressTextField = this.page.locator(
      '//*[@id="mfid_user[email]"]'
    );
    const loginButton = this.page.locator("#submitto");
    const passwordTextField = this.page.locator(
      '//*[@id="mfid_user[password]"]'
    );
    await emailAddressTextField.fill(email);
    await loginButton.click();
    await expect(passwordTextField).toBeVisible(); // password text field appears after email is entered
    await passwordTextField.fill(password);
    await loginButton.click();

    // two factor auth
    await this.page.waitForURL(/(two_factor_auth|home)/);
    // input and submit TOTP
    if (this.page.url().includes("two_factor_auth") && !totpSecret) {
      throw new Error("TOTP secret is required for two factor auth.");
    }
    const totpTextField = this.page.locator('//*[@id="otp_attempt"]');
    const totpSubmitButton = this.page.locator('//*[@id="submitto"]');
    const { otp } = TOTP.generate(totpSecret || "", { digits: 6 });
    await totpTextField.fill(otp);
    await totpSubmitButton.click();

    // wait for navigation to home page
    await expect(this.page).toHaveURL(redirectUrl || Env.BASE_URL);

    // save cookies
    const storageState = await this.page
      .context()
      .storageState({ path: storageStatePath });
    const cookies = await storageState.cookies;
    const formattedCookies = cookies
      .map((cookie) => `${cookie.name}=${cookie.value}`)
      .join("; ");
    const formattedCookieJsonContent = JSON.stringify(
      formattedCookies,
      null,
      2
    );
    fs.writeFileSync(cookieFilePath, formattedCookieJsonContent);
  }
}
