/**
 * ROLE-COMPARE EXPLORATORY — Stormwind LMS
 *
 * Logs in as STUDENT then as MANAGER (santiago+mobilestudentmanager), captures
 * each role's landing page, top-nav, sidebar links, and role-specific surfaces,
 * and diffs them to surface manager-only automatable scenarios.
 *
 * Read-only / non-destructive: navigation + DOM inspection only, no form submits,
 * no data creation.
 */
const { chromium } = require('@playwright/test');
const users = require('../data/users');
const BASE = 'https://test-spectre.pantheonsite.io';

async function login(page, user) {
    await page.goto(BASE + '/user/login');
    await page.locator('#email-only').fill(user.email);
    await page.getByRole('button', { name: 'Enter' }).click();
    await page.getByRole('textbox', { name: 'Password' }).waitFor({ state: 'visible' });
    await page.getByRole('textbox', { name: 'Password' }).fill(user.password);
    await page.getByRole('button', { name: 'Log in' }).click();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1500);
}

async function capture(page, label) {
    const landing = page.url();
    const data = await page.evaluate(() => {
        const txt = el => (el.textContent || '').replace(/\s+/g, ' ').trim();
        const uniq = a => [...new Set(a.filter(Boolean))];
        // top nav links
        const nav = uniq([...document.querySelectorAll('nav a, header a')]
            .map(a => txt(a)).filter(t => t && t.length < 30));
        // sidebar links (common patterns)
        const side = uniq([...document.querySelectorAll('.sidebar a, aside a, [class*="side"] a')]
            .map(a => txt(a)).filter(t => t && t.length < 30));
        // primary headings
        const headings = uniq([...document.querySelectorAll('h1,h2')].map(txt).filter(t => t && t.length < 60)).slice(0, 8);
        // buttons
        const buttons = uniq([...document.querySelectorAll('button')].map(txt).filter(t => t && t.length < 30)).slice(0, 20);
        return { nav, side, headings, buttons };
    });
    console.log(`\n===== ${label} =====`);
    console.log('LANDING:', landing);
    console.log('NAV   :', JSON.stringify(data.nav));
    console.log('SIDE  :', JSON.stringify(data.side));
    console.log('H1/H2 :', JSON.stringify(data.headings));
    console.log('BTNS  :', JSON.stringify(data.buttons));
    return { landing, ...data };
}

(async () => {
    const browser = await chromium.launch({ headless: true });

    // STUDENT
    const sPage = await (await browser.newContext()).newPage();
    await login(sPage, users.student);
    const student = await capture(sPage, 'STUDENT');

    // MANAGER
    const mPage = await (await browser.newContext()).newPage();
    await login(mPage, users.manager);
    const manager = await capture(mPage, 'MANAGER');

    // Probe manager-only surfaces: team reporting (landing) + team nav destinations
    console.log('\n===== MANAGER TEAM SURFACES =====');
    for (const path of ['/admin/dashboard', '/admin/due-dates', '/admin/add-users',
                        '/admin/manage-learning-paths']) {
        const res = await mPage.request.get(BASE + path).catch(() => null);
        console.log(`${path} → ${res ? res.status() : 'ERR'}`);
    }

    // DIFF: nav/side present for manager but NOT student
    const diff = (a, b) => a.filter(x => !b.includes(x));
    console.log('\n===== ROLE DIFF =====');
    console.log('NAV manager-only :', JSON.stringify(diff(manager.nav, student.nav)));
    console.log('NAV student-only :', JSON.stringify(diff(student.nav, manager.nav)));
    console.log('SIDE manager-only:', JSON.stringify(diff(manager.side, student.side)));
    console.log('SIDE student-only:', JSON.stringify(diff(student.side, manager.side)));

    await browser.close();
})();
