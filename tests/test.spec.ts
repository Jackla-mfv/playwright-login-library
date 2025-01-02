import { test } from "@/src";

test.describe("MFID", () => {
    test("login", async ({ mfid, page }) => {
        await page.goto(process.env.BASE_URL);
        await mfid.login({
            email: "",
            password: "",
            totpSecret: "",
        });
    });
});