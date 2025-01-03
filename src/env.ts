export class Env {
    public static readonly BASE_URL = process.env.BASE_URL || 'https://example.com';
    public static readonly MFID_URL = process.env.MFID_URL || 'https://mfid.example.com';
    public static readonly MFID_EMAIL = process.env.MFID_EMAIL || '';
    public static readonly MFID_PASSWORD = process.env.MFID_PASSWORD || '';
    public static readonly MFID_TOTP_SECRET = process.env.MFID_TOTP_SECRET || '';
}