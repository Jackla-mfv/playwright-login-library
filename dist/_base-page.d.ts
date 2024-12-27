import { Page } from '@playwright/test';
export declare class BasePage {
    readonly page: Page;
    protected readonly url?: string;
    constructor(page: Page);
    goto(): Promise<void>;
}
