import { Page } from 'playwright';
export interface LoginOptions {
    username: string;
    password: string;
    loginUrl: string;
    usernameSelector: string;
    passwordSelector: string;
    submitButtonSelector: string;
}
export declare function login(page: Page, options: LoginOptions): Promise<void>;
