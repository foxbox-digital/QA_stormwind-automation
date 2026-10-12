const { expect } = require('@playwright/test');

/**
 * BasePage - Foundation class for all Page Objects
 * Uses modern Playwright patterns with Locator API
 */
class BasePage {
    constructor(page) {
        this.page = page;
    }

    // Navigation
    async navigate(url) {
        await this.page.goto(url);
        await this.page.waitForLoadState('domcontentloaded');
    }

    async waitForPageLoad() {
        await this.page.waitForLoadState('domcontentloaded');
    }

    async getCurrentUrl() {
        return this.page.url();
    }

    async urlContains(text) {
        return this.page.url().includes(text);
    }

    // Locator helpers - prefer these over raw selectors
    getByRole(role, options) {
        return this.page.getByRole(role, options);
    }

    getByText(text, options) {
        return this.page.getByText(text, options);
    }

    getByLabel(label, options) {
        return this.page.getByLabel(label, options);
    }

    getByPlaceholder(placeholder, options) {
        return this.page.getByPlaceholder(placeholder, options);
    }

    getByTestId(testId) {
        return this.page.getByTestId(testId);
    }

    locator(selector) {
        return this.page.locator(selector);
    }

    // Wait utilities
    async waitForElement(locator, options = {}) {
        if (typeof locator === 'string') {
            await this.page.locator(locator).waitFor(options);
        } else {
            await locator.waitFor(options);
        }
    }

    async waitForUrl(urlPattern) {
        await this.page.waitForURL(urlPattern);
    }

    // Visibility checks
    async isVisible(locatorOrSelector) {
        if (typeof locatorOrSelector === 'string') {
            return await this.page.locator(locatorOrSelector).isVisible();
        }
        return await locatorOrSelector.isVisible();
    }

    async isHidden(locatorOrSelector) {
        if (typeof locatorOrSelector === 'string') {
            return await this.page.locator(locatorOrSelector).isHidden();
        }
        return await locatorOrSelector.isHidden();
    }

    // Assertions - built-in expect
    async expectVisible(locator) {
        await expect(locator).toBeVisible();
    }

    async expectHidden(locator) {
        await expect(locator).toBeHidden();
    }

    async expectText(locator, text) {
        await expect(locator).toContainText(text);
    }

    async expectUrl(urlPattern) {
        await expect(this.page).toHaveURL(urlPattern);
    }

    // Screenshot utility
    async takeScreenshot(name) {
        await this.page.screenshot({ path: `screenshots/${name}.png` });
    }

    // Dismiss the "Stay in the loop" notification popup if it appears
    async dismissNotificationPopup() {
        const notNowBtn = this.page.getByRole('button', { name: 'Not Now' });
        if (await notNowBtn.isVisible()) {
            await notNowBtn.click();
        }
    }
}

module.exports = BasePage;
