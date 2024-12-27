"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginPage = void 0;
const test_1 = require("@playwright/test");
const totp_generator_1 = require("totp-generator");
const url_list_1 = require("./url-list");
const _base_page_1 = require("./_base-page");
class LoginPage extends _base_page_1.BasePage {
    constructor(page) {
        super(page);
        this.page = page;
        this.url = url_list_1.URL_LIST.LOGIN;
        // this.loginButton = this.page.getByTestId('login-button')
        this.loginButton = this.page.getByRole('button', { name: 'マネーフォワードIDでログインして続行' });
    }
    async login(email, password, redirectUrl, totpSecret) {
        if (!totpSecret) {
            await this.loginWithMfid(email, password);
        }
        else {
            await this.loginWithMfid(email, password, totpSecret);
        }
        await (0, test_1.expect)(this.page).toHaveURL(new RegExp(`^${process.env.BASE_URL}${redirectUrl || url_list_1.URL_LIST.HOMEPAGE}`), {
            timeout: 5000,
        });
    }
    async loginWithMfid(email, password, totpSecret) {
        if (!totpSecret) {
            throw new Error('TOTP Secret is not defined');
        }
        await this.goto();
        await this.loginButton.click();
        await (0, test_1.expect)(await this.page).toHaveURL(new RegExp(`^${process.env.MFID_BASE_URL}/sign_in?`));
        await this.page.locator('[name="mfid_user[email]"]').fill(email);
        await this.page.locator('#submitto').click();
        await this.page.locator('[name="mfid_user[password]"]').fill(password);
        await this.page.locator('#submitto').click();
        await this.page.waitForLoadState('domcontentloaded');
        await (0, test_1.expect)(async () => {
            // input and submit TOTP
            const totpTextField = this.page.locator('//*[@id="otp_attempt"]');
            const totpSubmitButton = this.page.locator('//*[@id="submitto"]');
            const { otp } = totp_generator_1.TOTP.generate(totpSecret, { digits: 6 });
            await totpTextField.fill(otp);
            await totpSubmitButton.click();
        }).toPass({
            timeout: 10 * 1000,
        });
        try {
            await (0, test_1.expect)(this.page).toHaveURL(new RegExp(`^${process.env.MFID_BASE_URL}/passkey_promotion`), {
                timeout: 5 * 1000,
            });
            await this.page.locator('a', { hasText: 'No thanks' }).click();
        }
        catch (e) {
            // No Passkey Promotion page. So do nothing
        }
        try {
            await (0, test_1.expect)(this.page).toHaveURL(new RegExp(`^${process.env.BASE_URL}${url_list_1.URL_LIST.MFID_AUTH}`), {
                timeout: 5 * 1000,
            });
        }
        catch (e) {
            // Already login
        }
    }
}
exports.LoginPage = LoginPage;
