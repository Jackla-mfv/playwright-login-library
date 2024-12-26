import { Page } from 'playwright';

export interface LoginOptions {
    username: string;
    password: string;
    loginUrl: string;
    usernameSelector: string;
    passwordSelector: string;
    submitButtonSelector: string;
}

export async function login(page: Page, options: LoginOptions): Promise<void> {
    const {
        username,
        password,
        loginUrl,
        usernameSelector,
        passwordSelector,
        submitButtonSelector,
    } = options;

    // Navigate to the login page
    await page.goto(loginUrl);

    // Fill in the username and password
    await page.fill(usernameSelector, username);
    await page.fill(passwordSelector, password);

    // Click the login button
    await page.click(submitButtonSelector);

    // Wait for navigation or a specific selector
    await page.waitForNavigation();
}