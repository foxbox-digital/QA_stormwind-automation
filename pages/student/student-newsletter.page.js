const BasePage = require('../base.page');
const StudentNavigationPage = require('./student-navigation.page');

/**
 * StudentNewsletterPage - Newsletter page (external link)
 * URL: partners.stormwind.com/*-newsletter/
 * Note: Content changes frequently, only verify page opens correctly
 */
class StudentNewsletterPage extends BasePage {
    constructor(page) {
        super(page);
        this.navigation = new StudentNavigationPage(page);
    }

    /**
     * Click the newsletter link and wait for the current page to navigate
     * @returns {Promise<Page>} The page displaying the newsletter
     */
    async clickNewsletterAndNavigate() {
        await Promise.all([
            this.page.waitForURL(/partners\.stormwind\.com\/.*newsletter/i, { timeout: 30000 }),
            this.navigation.sidebarNewsletter.click()
        ]);
        await this.page.waitForLoadState('domcontentloaded');
        return this.page;
    }

    /**
     * Verify the newsletter page opened correctly
     * @param {Page} newsletterPage - The page navigated to the newsletter
     */
    async verifyNewsletterPageOpened(newsletterPage) {
        const url = newsletterPage.url();
        return url.includes('partners.stormwind.com') && url.includes('newsletter');
    }

    /**
     * Verify URL contains expected domain
     * @param {Page} newsletterPage - The page navigated to the newsletter
     */
    async isOnCorrectDomain(newsletterPage) {
        return newsletterPage.url().includes('partners.stormwind.com');
    }

    /**
     * Verify URL contains newsletter
     * @param {Page} newsletterPage - The page navigated to the newsletter
     */
    async isNewsletterURL(newsletterPage) {
        return newsletterPage.url().includes('newsletter');
    }

    /**
     * Close the page
     * @param {Page} newsletterPage - The page navigated to the newsletter
     */
    async closeNewTab(newsletterPage) {
        await newsletterPage.close();
    }
}

module.exports = StudentNewsletterPage;
