/**
 * LOGIN EXPLORATORY — Stormwind LMS  (/user/login)
 *
 * Probes the two-step login flow and its edge cases. Read-only / non-destructive:
 * no account creation. Negative auth attempts use throwaway emails to avoid
 * lockout on the real test accounts.
 */
const { chromium } = require('@playwright/test');
const users = require('../data/users');

const BASE = 'https://test-spectre.pantheonsite.io';
const findings = [];
function log(type, area, message) {
    const entry = `[${type}] ${area}: ${message}`;
    console.log(entry);
    findings.push(entry);
}
async function v(locator) { return locator.isVisible().catch(() => false); }

(async () => {
    const browser = await chromium.launch({ headless: true });
    const ctx = await browser.newContext();
    const page = await ctx.newPage();

    // ── STRUCTURE: what is actually on the login page ──────────────────────
    await page.goto(BASE + '/user/login');
    await page.waitForLoadState('domcontentloaded');
    log('INFO', 'Structure', `URL: ${page.url()} | title: ${await page.title()}`);
    log('INFO', 'Structure', `#email-only visible: ${await v(page.locator('#email-only'))}`);
    log('INFO', 'Structure', `Enter btn visible: ${await v(page.getByRole('button', { name: 'Enter' }))}`);
    // Is the password field present BEFORE the Enter step (progressive disclosure)?
    log('INFO', 'Structure', `Password field visible pre-Enter: ${await v(page.getByRole('textbox', { name: 'Password' }))}`);
    // Forgot-password / register links?
    for (const name of ['Forgot', 'Reset', 'Register', 'Create account', 'Sign up']) {
        const link = page.getByText(name, { exact: false }).first();
        if (await v(link)) log('INFO', 'Structure', `Link/text present: "${name}"`);
    }

    // ── STEP 1 EDGE: empty email + Enter ───────────────────────────────────
    await page.locator('#email-only').fill('');
    await page.getByRole('button', { name: 'Enter' }).click().catch(() => {});
    await page.waitForTimeout(800);
    log('PROBE', 'Empty email', `password now visible: ${await v(page.getByRole('textbox', { name: 'Password' }))} | url: ${page.url()}`);

    // ── STEP 1 EDGE: malformed email ───────────────────────────────────────
    await page.goto(BASE + '/user/login');
    await page.locator('#email-only').fill('not-an-email');
    await page.getByRole('button', { name: 'Enter' }).click().catch(() => {});
    await page.waitForTimeout(800);
    log('PROBE', 'Malformed email', `password visible: ${await v(page.getByRole('textbox', { name: 'Password' }))}`);
    log('PROBE', 'Malformed email', `.error-message visible: ${await v(page.locator('.error-message'))} | text: ${await page.locator('.error-message').first().textContent().catch(() => '(none)')}`);

    // ── STEP 1 EDGE: unknown email (account enumeration?) ──────────────────
    await page.goto(BASE + '/user/login');
    await page.locator('#email-only').fill('nobody-xyz-12345@foxbox.com');
    await page.getByRole('button', { name: 'Enter' }).click().catch(() => {});
    await page.waitForTimeout(1200);
    log('PROBE', 'Unknown email', `password visible: ${await v(page.getByRole('textbox', { name: 'Password' }))}`);
    log('PROBE', 'Unknown email', `.error-message visible: ${await v(page.locator('.error-message'))} | text: ${await page.locator('.error-message').first().textContent().catch(() => '(none)')}`);

    // ── STEP 2 EDGE: valid email, WRONG password ───────────────────────────
    await page.goto(BASE + '/user/login');
    await page.locator('#email-only').fill(users.student.email);
    await page.getByRole('button', { name: 'Enter' }).click();
    await page.getByRole('textbox', { name: 'Password' }).waitFor({ state: 'visible' }).catch(() => {});
    if (await v(page.getByRole('textbox', { name: 'Password' }))) {
        await page.getByRole('textbox', { name: 'Password' }).fill('definitely-wrong-pw');
        await page.getByRole('button', { name: 'Log in' }).click();
        await page.waitForTimeout(1500);
        log('PROBE', 'Wrong password', `still on login: ${page.url().includes('login')} | url: ${page.url()}`);
        log('PROBE', 'Wrong password', `.error-message visible: ${await v(page.locator('.error-message'))} | text: ${await page.locator('.error-message').first().textContent().catch(() => '(none)')}`);
        // Any visible error text at all?
        const bodyErr = await page.getByText(/incorrect|invalid|not recognized|unable|error|wrong/i).first().textContent().catch(() => '(none)');
        log('PROBE', 'Wrong password', `visible error-ish text: ${bodyErr}`);
    }

    // ── HAPPY PATH: valid login redirect target ────────────────────────────
    await page.goto(BASE + '/user/login');
    await page.locator('#email-only').fill(users.student.email);
    await page.getByRole('button', { name: 'Enter' }).click();
    await page.getByRole('textbox', { name: 'Password' }).waitFor({ state: 'visible' });
    await page.getByRole('textbox', { name: 'Password' }).fill(users.student.password);
    await page.getByRole('button', { name: 'Log in' }).click();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1500);
    log('PASS', 'Happy path', `logged in, redirected to: ${page.url()}`);

    // ── Already-authenticated: hitting /user/login while logged in ─────────
    await page.goto(BASE + '/user/login');
    await page.waitForTimeout(1000);
    log('PROBE', 'Auth revisit', `/user/login while authed → ${page.url()} | email field visible: ${await v(page.locator('#email-only'))}`);

    console.log('\n================ SUMMARY ================');
    findings.forEach(f => console.log(f));
    await browser.close();
})();
