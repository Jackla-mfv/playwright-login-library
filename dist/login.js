"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = login;
async function login(page, options) {
    const { username, password, loginUrl, usernameSelector, passwordSelector, submitButtonSelector, } = options;
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
