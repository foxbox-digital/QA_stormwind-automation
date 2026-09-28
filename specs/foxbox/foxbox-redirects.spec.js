const { test, expect } = require('@playwright/test');

test.use({ baseURL: 'https://foxbox.com' });

// FOX2-210: /about and /culture currently issue 307 Temporary redirects.
// They must be 301 or 308 (Permanent) so browsers cache them and link equity passes.
test.describe('FOX2-210 — /about and /culture should use permanent redirects', () => {
    async function captureRedirectStatus(page, pathname) {
        let redirectStatus = null;
        page.on('response', response => {
            try {
                const url = new URL(response.url());
                const isRedirect = response.status() >= 300 && response.status() < 400;
                if ((url.pathname === pathname || url.pathname === pathname + '/') && isRedirect) {
                    redirectStatus = response.status();
                }
            } catch {
                // ignore non-parseable URLs (e.g. data: or blob:)
            }
        });
        await page.goto(pathname);
        return redirectStatus;
    }

    test('/about should redirect with 301 or 308, not temporary 307', async ({ page }) => {
        const status = await captureRedirectStatus(page, '/about');
        expect(status, 'No redirect was captured for /about').not.toBeNull();
        expect([301, 308], `Expected permanent redirect but got ${status}`).toContain(status);
    });

    test('/culture should redirect with 301 or 308, not temporary 307', async ({ page }) => {
        const status = await captureRedirectStatus(page, '/culture');
        expect(status, 'No redirect was captured for /culture').not.toBeNull();
        expect([301, 308], `Expected permanent redirect but got ${status}`).toContain(status);
    });
});
