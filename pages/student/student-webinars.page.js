const BasePage = require('../base.page');
const StudentNavigationPage = require('./student-navigation.page');
const StudentFooterPage = require('./student-footer.page');

/**
 * StudentWebinarsPage - Webinars page (accessed from sidebar)
 * URL: /webinar
 */
class StudentWebinarsPage extends BasePage {
    constructor(page) {
        super(page);

        // Compose shared components
        this.navigation = new StudentNavigationPage(page);
        this.footer = new StudentFooterPage(page);

        this.pageTitle = page.getByRole('heading', { name: 'Webinars' });

        // Search
        this.searchInput = page.locator('#edit-search-api-fulltext');
        this.searchButton = page.locator('.search-button, button[type="submit"]');

        // Webinar cards
        this.webinarCards = page.locator('.webinar-card, [class*="webinar"]').filter({ has: page.locator('img') });

        // Individual card elements (for use with specific card)
        this.webinarTitle = page.locator('.webinar-title, h3, h4');
        this.presenterName = page.locator('.presenter-name, .author');
    }

    async goto() {
        await this.page.goto('/webinar');
        await this.page.waitForLoadState('domcontentloaded');
    }

    async navigateFromSidebar() {
        await this.navigation.clickWebinars();
    }

    // Search functionality
    async searchWebinar(searchTerm) {
        await this.searchInput.fill(searchTerm);
        await this.page.waitForTimeout(500);
    }

    async clearSearch() {
        await this.searchInput.clear();
    }

    // Webinar cards
    async getWebinarCardsCount() {
        return await this.webinarCards.count();
    }

    async getWebinarCardByTitle(title) {
        return this.page.locator(`[class*="webinar"]`).filter({ hasText: title });
    }

    async clickWebinarByTitle(title) {
        const card = await this.getWebinarCardByTitle(title);
        await card.click();
    }

    async getFirstWebinarTitle() {
        return await this.webinarCards.first().locator('h3, h4, .title').textContent();
    }

    // URL verification
    async isOnCorrectURL() {
        return this.page.url().includes('/webinar');
    }

    // Assertions
    async expectPageTitleVisible() {
        await this.expectVisible(this.pageTitle);
    }

    async expectSearchInputVisible() {
        await this.expectVisible(this.searchInput);
    }

    async expectWebinarCardsVisible() {
        const count = await this.getWebinarCardsCount();
        return count > 0;
    }

    async expectPageLoaded() {
        await this.expectPageTitleVisible();
        await this.expectSearchInputVisible();
    }
}

module.exports = StudentWebinarsPage;
