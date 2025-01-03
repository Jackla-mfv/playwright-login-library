import { test } from "@/src";
import { Env } from "@/src/env";

test.describe("MFID", () => {
    test("login with valid user credential for payroll", async ({ mfid, page }) => {
        await page.goto(Env.BASE_URL);
        await mfid.login({
            email: Env.MFID_EMAIL,
            password: Env.MFID_PASSWORD,
            totpSecret: Env.MFID_TOTP_SECRET,
        });
    });
});