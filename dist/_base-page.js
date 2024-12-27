"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasePage = void 0;
class BasePage {
    constructor(page) {
        this.page = page;
    }
    async goto() {
        if (this.url) {
            await this.page.goto(this.url);
        }
        else {
            throw new Error('URL is not defined');
        }
    }
}
exports.BasePage = BasePage;
