import { test as baseTest } from "@playwright/test";
import { Page } from "@playwright/test";
import { MFID } from "@/src/index";

interface Fixtures {
  mfid: MFID;
}

export const test = baseTest.extend<Fixtures>({
  page: async ({ browser }, use) => {
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
  },
  mfid: async ({ page }, use) => {
    const mfid = new MFID(page);
    use(mfid);
  },
});

export const expect = test.expect;
