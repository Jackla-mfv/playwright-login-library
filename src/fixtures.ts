import { test as baseTest } from "@playwright/test";
import { Page } from "@playwright/test";

interface PageFixture {
    page: Page;    
}

export const test = baseTest.extend<PageFixture>({
    page: async ({browser}, use) => {
            const context = await browser.newContext({
              locale: "ja-JP",
            });
        
            context.addCookies([
              {
                name: "promotion_page_visited",
                value: "true",
                url: process.env.MFID_URL,
              },
            ]);
          
            const page: Page = await context.newPage();
            use(page);
    }
});