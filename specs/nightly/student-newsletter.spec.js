const { test, expect } = require('../../fixtures/fixtures');

test.describe('Student - Newsletter Link', () => {
    test('should navigate to newsletter', async ({ studentNewsletter }) => {
        test.setTimeout(90000);
        // Navigate to My Classroom first (where sidebar is visible)
        await studentNewsletter.navigation.navigateToMyClassroom();

        // The sidebar link navigates the current tab to the newsletter.
        const newsletterPage = await studentNewsletter.clickNewsletterAndNavigate();

        // Verify the destination domain and path.
        const isCorrectDomain = await studentNewsletter.isOnCorrectDomain(newsletterPage);
        expect(isCorrectDomain).toBeTruthy();

        // Verify URL contains newsletter
        const isNewsletterURL = await studentNewsletter.isNewsletterURL(newsletterPage);
        expect(isNewsletterURL).toBeTruthy();
    });

    test('should navigate to newsletter from sidebar link', async ({ studentMyClassroom }) => {
        test.setTimeout(90000);
        // Navigate to My Classroom
        await studentMyClassroom.navigateFromNav();

        const page = studentMyClassroom.page;
        await Promise.all([
            page.waitForURL(/partners\.stormwind\.com\/.*newsletter/i, { timeout: 30000 }),
            studentMyClassroom.navigation.sidebarNewsletter.click()
        ]);

        // Verify opens to partners.stormwind.com
        expect(page.url()).toContain('partners.stormwind.com');
        expect(page.url()).toContain('newsletter');
    });
});
