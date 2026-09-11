const BasePage = require('../base.page');
const AdminNavigationPage = require('./admin-navigation.page');
const StudentFooterPage = require('../student/student-footer.page');

/**
 * AdminAddUsersPage - Add Users page for managers
 * URL: /setup/team/{userId}/invitations?group={groupId}
 */
class AdminAddUsersPage extends BasePage {
    constructor(page) {
        super(page);

        // Compose shared components
        this.navigation = new AdminNavigationPage(page);
        this.footer = new StudentFooterPage(page);

        // Page title
        this.pageTitle = page.getByRole('heading', { name: 'Add Users' });

        // Description text — redesigned Sep 2026: old "You are adding new users to the group named"
        // replaced with "Group for everyone below" label; old "licenses available" replaced with "licenses left"
        this.groupDescriptionText = page.getByText('Group for everyone below');
        this.licensesAvailableText = page.getByText(/licenses left/);

        // ========== USER INPUT FORM ==========
        // <input placeholder="First Name" id="edit-user-form-group-0-first-name">
        this.firstNameInput = page.getByPlaceholder('First Name');
        this.lastNameInput = page.getByPlaceholder('Last Name');
        this.emailInput = page.getByPlaceholder('Email');
        this.licenseDropdown = page.locator('select').filter({ has: page.locator('option') }).first();

        // Add row link
        this.addRowLink = page.getByText('Add row');

        // ========== ACTION BUTTONS ==========
        // CANCEL link (actually an <a> tag)
        // <a href="/home" class="btn btn-outline-secondary-action mb-3 mr-3" id="edit-actions-cancel">
        this.cancelBtn = page.locator('#edit-actions-cancel');

        // SAVE button
        // <input class="btn btn-primary..." id="edit-actions-submit" value="Save">
        this.saveBtn = page.locator('#edit-actions-submit');

    }

    /**
     * Navigate to Add Users page
     */
    async goto() {
        await this.page.goto('/setup/team/145164/invitations?group=19126');
        await this.page.waitForLoadState('domcontentloaded');
    }

    /**
     * Check if on correct URL
     * @returns {boolean}
     */
    async isOnCorrectURL() {
        const url = this.page.url();
        return url.includes('/invitations');
    }

    // --- Assertions ---

    /**
     * Assert navigation bar is visible
     */
    async expectNavigationVisible() {
        await this.navigation.expectMainNavVisible();
    }

    /**
     * Assert admin sub-navigation is visible
     */
    async expectAdminSubNavVisible() {
        await this.navigation.expectAdminSubNavVisible();
    }

    /**
     * Assert page title is visible
     */
    async expectPageTitleVisible() {
        await this.expectVisible(this.pageTitle);
    }

    /**
     * Assert page description is visible
     */
    async expectDescriptionVisible() {
        await this.expectVisible(this.groupDescriptionText);
        await this.expectVisible(this.licensesAvailableText);
    }

    /**
     * Assert user form inputs are visible
     */
    async expectUserFormVisible() {
        await this.expectVisible(this.firstNameInput);
        await this.expectVisible(this.lastNameInput);
        await this.expectVisible(this.emailInput);
        await this.expectVisible(this.addRowLink);
    }

    /**
     * Assert action buttons are visible
     */
    async expectActionButtonsVisible() {
        await this.expectVisible(this.cancelBtn);
        await this.expectVisible(this.saveBtn);
    }

    /**
     * Assert complete Add Users page
     */
    async expectAddUsersPageComplete() {
        await this.expectNavigationVisible();
        await this.expectAdminSubNavVisible();
        await this.expectPageTitleVisible();
        await this.expectDescriptionVisible();
        await this.expectUserFormVisible();
        await this.expectActionButtonsVisible();
    }
}

module.exports = AdminAddUsersPage;
