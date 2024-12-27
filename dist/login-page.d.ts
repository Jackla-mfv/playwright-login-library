import { Page } from '@playwright/test';
import { BasePage } from './_base-page';
export declare class LoginPage extends BasePage {
    readonly page: Page;
    protected readonly url: string;
    private readonly loginButton;
    constructor(page: Page);
    login(email: string, password: string, redirectUrl?: string, totpSecret?: string): Promise<void>;
    private loginWithMfid;
}
