import { test } from "@/src";
import { Env } from "@/src/env";

test.describe("MFID", () => {
    test("login", async ({ mfid, page }) => {
        await page.goto(Env.BASE_URL);
        await mfid.login({
            email: "",
            password: "",
            totpSecret: "",
        });
    });
});