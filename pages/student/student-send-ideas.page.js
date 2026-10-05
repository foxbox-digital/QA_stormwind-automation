const BasePage = require('../base.page');

/**
 * StudentSendIdeasPage - Send Ideas feedback portal (opens in new tab)
 * External site: feedback.stormwindstudios.com
 * Powered by Featurebase
 */
class StudentSendIdeasPage extends BasePage {
    constructor(page) {
        super(page);

        // Header/Logo
        this.logoHeading = page.getByRole('heading', { name: 'StormWind Studios' });

        // Sign in button
        this.signInButton = page.getByRole('button', { name: /Sign in/i });

        // Main content
        this.mainHeading = page.getByRole('heading', { name: /Have something to say/i });
        this.subtitle = page.getByText('Tell us how we could make the product more useful to you.');

        // Sort tabs
        this.newTab = page.getByRole('button', { name: 'New' });
        this.topTab = page.getByRole('button', { name: 'Top' });
        this.trendingTab = page.getByRole('button', { name: 'Trending' });

        // Search and create
        this.searchButton = page.getByRole('button', { name: 'Search' }).first();
        this.createPostButton = page.getByRole('link', { name: /Create A New Post/i });

        // Sidebar
        this.mostHelpfulHeading = page.getByText('Most helpful');
        this.poweredByFeaturebase = page.getByText('Powered by Featurebase');
    }

    /**
     * Open Send Ideas in new tab from sidebar
     * @param {import('@playwright/test').BrowserContext} context - Browser context
     * @param {import('@playwright/test').Page} currentPage - Current page
     * @returns {Promise<import('@playwright/test').Page>} New tab page
     */
    async openFromSidebar(context, currentPage) {
        const sendIdeasLink = currentPage.getByRole('link', { name: ' Send Ideas' }).first();

        const [newPage] = await Promise.all([
            context.waitForEvent('page'),
            sendIdeasLink.click()
        ]);

        await newPage.waitForLoadState('domcontentloaded');
        return newPage;
    }

    /**
     * Set the page reference (for new tab)
     */
    setPage(newPage) {
        this.page = newPage;
        // Re-initialize locators with new page
        this.logoHeading = newPage.getByRole('heading', { name: 'StormWind Studios' });
        this.signInButton = newPage.getByRole('button', { name: /Sign in/i });
        this.mainHeading = newPage.getByRole('heading', { name: /Have something to say/i });
        this.subtitle = newPage.getByText('Tell us how we could make the product more useful to you.');
        this.newTab = newPage.getByRole('button', { name: 'New' });
        this.topTab = newPage.getByRole('button', { name: 'Top' });
        this.trendingTab = newPage.getByRole('button', { name: 'Trending' });
        this.searchButton = newPage.getByRole('button', { name: 'Search' }).first();
        this.createPostButton = newPage.getByRole('link', { name: /Create A New Post/i });
        this.mostHelpfulHeading = newPage.getByText('Most helpful');
        this.poweredByFeaturebase = newPage.getByText('Powered by Featurebase');
    }

    // URL verification
    isOnSendIdeasPage() {
        return this.page.url().includes('feedback.stormwindstudios.com');
    }

    // Assertions - Main content
    async expectMainHeadingVisible() {
        await this.expectVisible(this.mainHeading);
    }

    async expectSubtitleVisible() {
        await this.expectVisible(this.subtitle);
    }

    // Assertions - Search and create
    async expectSearchButtonVisible() {
        await this.expectVisible(this.searchButton);
    }

    async expectCreatePostButtonVisible() {
        await this.expectVisible(this.createPostButton);
    }

    // Assertions - Sort tabs
    async expectSortTabsVisible() {
        await this.expectVisible(this.newTab);
        await this.expectVisible(this.topTab);
        await this.expectVisible(this.trendingTab);
    }

    /**
     * Verify all static page elements
     */
    async verifyPageLoaded() {
        await this.expectMainHeadingVisible();
        await this.expectSubtitleVisible();
        await this.expectSearchButtonVisible();
        await this.expectCreatePostButtonVisible();
    }
}

module.exports = StudentSendIdeasPage;
