const BasePage = require('./base.page');
const URLS = require('../data/urls');

class LoginPage extends BasePage {
    constructor(page) {
        super(page);
        // Single-step login form. Three forms share "Email" labels (main, magic-link,
        // SSO), so scope to the standard Drupal field IDs to stay unambiguous.
        this.emailInput = page.locator('#edit-name');
        this.passwordInput = page.locator('#edit-pass');
        this.loginButton = page.locator('#edit-submit');
        // Login errors render as a role="alert" region.
        this.errorAlert = page.getByRole('alert');
    }

    async goto() {
        await this.navigate(URLS.LOGIN);
    }

    async login(email, password) {
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }

    async enterEmail(email) {
        await this.emailInput.fill(email);
    }

    async enterPassword(password) {
        await this.passwordInput.fill(password);
    }

    async clickLogin() {
        await this.loginButton.click();
    }

    async isErrorMessageDisplayed() {
        return await this.errorAlert.isVisible();
    }

    async getErrorMessage() {
        return await this.errorAlert.textContent();
    }

    async expectErrorMessage(expectedText) {
        await this.expectVisible(this.errorAlert);
        await this.expectText(this.errorAlert, expectedText);
    }

    // REUSE_METHOD: expectStillOnLogin
    async expectStillOnLogin() {
        await this.expectUrl(/\/user\/login/);
    }

    // REUSE_METHOD: expectRedirectedToClassroom
    async expectRedirectedToClassroom() {
        await this.page.waitForURL(/\/my_classroom\//, { timeout: 30000 });
    }

    // REUSE_METHOD: expectRedirectedToTeamReporting
    async expectRedirectedToTeamReporting() {
        await this.page.waitForURL(/\/team\/\d+\/reporting/, { timeout: 30000 });
    }

    // REUSE_METHOD: expectRedirectedAwayFromLogin
    async expectRedirectedAwayFromLogin() {
        await this.page.waitForURL(url => !url.href.includes('/user/login'), { timeout: 30000 });
    }

    async expectEmailFieldHidden() {
        await this.expectHidden(this.emailInput);
    }
}

module.exports = LoginPage;
