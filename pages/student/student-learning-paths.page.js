const BasePage = require('../base.page');
const StudentNavigationPage = require('./student-navigation.page');
const StudentFooterPage = require('./student-footer.page');

/**
 * StudentLearningPathsPage - Learning Paths tab page object
 * Uses composition with shared navigation and footer components
 * URL: /learningpaths
 */
class StudentLearningPathsPage extends BasePage {
    constructor(page) {
        super(page);

        // Compose shared components
        this.navigation = new StudentNavigationPage(page);
        this.footer = new StudentFooterPage(page);

        this.pageHeading = page.getByRole('heading', { name: 'Learning Paths' });

        // Topic dropdown - it's a button with title="Topic" and class multiselect dropdown-toggle
        this.topicDropdown = page.locator('button[title="Topic"]');

        // Path Size dropdown - it's a select element with id="filter-duration"
        this.pathSizeDropdown = page.locator('#filter-duration');

        // Search input - input with class search-term and specific placeholder
        this.searchInput = page.locator('input.search-term');

        this.learningPathCards = page.locator('.learning-path-card');

        // Learning Path Modal elements - scoped to modal container
        this.modal = page.locator('.modal.show, .modal[style*="display: block"]');
        this.modalDialog = page.locator('.modal-dialog, .modal-content');
        this.modalTitle = this.modalDialog.locator('.modal-title, h2, h3').first();
        // Courses and duration are in specific spans inside learning-path-preview
        this.modalCoursesCount = page.locator('.learning-path-preview [class*="difficulty"]').filter({ hasText: 'courses' });
        this.modalDuration = page.locator('.learning-path-preview [class*="duration"]').filter({ hasText: 'hours' });
        this.modalSeeLearningPathLink = page.getByRole('link', { name: 'See Learning Path' });
        // Remove from Classroom is an <a> tag, not a button
        this.modalRemoveFromClassroomBtn = page.getByRole('link', { name: /remove from classroom/i });
        // Close button is an <a> with aria-label="Close"
        this.modalCloseButton = page.locator('a[aria-label="Close"][data-dismiss="modal"]');
    }

    /**
     * Navigate to Learning Paths page via navigation menu
     */
    async goto() {
        await this.navigation.navigateToLearningPaths();
        await this.learningPathCards.first().waitFor({ state: 'visible', timeout: 15000 });
    }

    /**
     * Navigate from navigation menu
     */
    async navigateFromNav() {
        await this.navigation.navigateToLearningPaths();
    }

    /**
     * Check if Learning Paths page is displayed
     * @returns {Promise<boolean>}
     */
    async isLearningPathsPageDisplayed() {
        return await this.pageHeading.isVisible();
    }

    /**
     * Check if on correct URL
     * @returns {Promise<boolean>}
     */
    async isOnCorrectURL() {
        return this.page.url().includes('/learningpaths');
    }

    // --- Filter Methods ---

    /**
     * Check if Topic dropdown is visible
     * @returns {Promise<boolean>}
     */
    async isTopicDropdownVisible() {
        return await this.topicDropdown.isVisible();
    }

    /**
     * Check if Path Size dropdown is visible
     * @returns {Promise<boolean>}
     */
    async isPathSizeDropdownVisible() {
        return await this.pathSizeDropdown.isVisible();
    }

    /**
     * Select a topic from the Topic dropdown
     * @param {string} topic - The topic to select
     */
    async selectTopic(topic) {
        await this.topicDropdown.click();
        await this.page.getByRole('option', { name: topic }).click();
    }

    /**
     * Select a path size from the Path Size dropdown
     * @param {string} pathSize - The path size to select
     */
    async selectPathSize(pathSize) {
        await this.pathSizeDropdown.click();
        await this.page.getByRole('option', { name: pathSize }).click();
    }

    // --- Search Methods ---

    /**
     * Check if search input is visible
     * @returns {Promise<boolean>}
     */
    async isSearchInputVisible() {
        return await this.searchInput.isVisible();
    }

    /**
     * Click on the search input field
     */
    async clickSearchInput() {
        await this.searchInput.click();
    }

    /**
     * Search for a learning path by name
     * @param {string} pathName - The learning path name to search for
     */
    async searchLearningPath(pathName) {
        await this.searchInput.click();
        await this.searchInput.fill(pathName);
    }

    /**
     * Clear the search input
     */
    async clearSearch() {
        await this.searchInput.clear();
    }

    /**
     * Press Enter key in the search input to trigger filtering
     */
    async pressEnterInSearch() {
        await this.searchInput.press('Enter');
    }

    /**
     * Select the first available option from the Topic multiselect dropdown
     */
    async selectFirstAvailableTopicOption() {
        await this.topicDropdown.click();
        const firstOption = this.page.locator('.multiselect__element').first();
        await firstOption.waitFor({ state: 'visible' });
        await firstOption.click();
    }

    /**
     * Clear the topic filter by deselecting the active option
     */
    async clearTopicFilter() {
        await this.topicDropdown.click();
        const selectedOption = this.page.locator('.multiselect__option--selected').first();
        if (await selectedOption.count() > 0 && await selectedOption.isVisible()) {
            await selectedOption.click();
        }
        await this.page.keyboard.press('Escape');
    }

    /**
     * Select a path size option by index (0 = All/default)
     * @param {number} index
     */
    async selectPathSizeOption(index) {
        await this.pathSizeDropdown.selectOption({ index });
    }

    /**
     * Reset path size filter to "All" (first/default option)
     */
    async resetPathSizeFilter() {
        await this.pathSizeDropdown.selectOption({ index: 0 });
    }

    // --- Learning Path Card Methods ---

    /**
     * Get count of learning path cards displayed
     * @returns {Promise<number>}
     */
    async getLearningPathsCount() {
        return await this.learningPathCards.count();
    }

    /**
     * Get a specific learning path card by name using the card title heading
     * @param {string} pathName - The learning path name
     * @returns {Locator}
     */
    getLearningPathCard(pathName) {
        return this.page.locator('.learning-path-card__title').filter({ hasText: pathName });
    }

    /**
     * Check if a specific learning path card is visible
     * @param {string} pathName - The learning path name
     * @returns {Promise<boolean>}
     */
    async isLearningPathCardVisible(pathName) {
        const card = this.getLearningPathCard(pathName);
        return await card.isVisible();
    }

    /**
     * Click on a specific learning path card to open modal
     * @param {string} pathName - The learning path name to click
     */
    async clickLearningPath(pathName) {
        // Click on the modal-toggle button inside the card
        const cardButton = this.page.locator('button.modal-toggle').filter({ hasText: pathName });
        await cardButton.click();
        // Wait for modal to be visible
        await this.modal.waitFor({ state: 'visible' });
    }

    // --- Modal Methods ---

    /**
     * Open learning path modal by clicking on card name
     * @param {string} pathName - The learning path name
     */
    async openLearningPathModal(pathName) {
        await this.clickLearningPath(pathName);
    }

    /**
     * Check if modal is visible
     * @returns {Promise<boolean>}
     */
    async isModalVisible() {
        return await this.modal.isVisible();
    }

    /**
     * Get modal title text
     * @returns {Promise<string>}
     */
    async getModalTitle() {
        return await this.modalTitle.textContent();
    }

    /**
     * Close the modal by clicking the X button
     */
    async closeModal() {
        await this.modalCloseButton.click();
        await this.modal.waitFor({ state: 'hidden' });
    }

    // --- Assertions ---

    /**
     * Assert page heading is visible
     */
    async expectPageHeadingVisible() {
        await this.expectVisible(this.pageHeading);
    }

    /**
     * Assert Topic dropdown is visible
     */
    async expectTopicDropdownVisible() {
        await this.expectVisible(this.topicDropdown);
    }

    /**
     * Assert Path Size dropdown is visible
     */
    async expectPathSizeDropdownVisible() {
        await this.expectVisible(this.pathSizeDropdown);
    }

    /**
     * Assert search input is visible
     */
    async expectSearchInputVisible() {
        await this.expectVisible(this.searchInput);
    }

    /**
     * Assert learning path cards are visible
     */
    async expectLearningPathCardsVisible() {
        const count = await this.getLearningPathsCount();
        if (count === 0) {
            throw new Error('No learning path cards found');
        }
    }

    /**
     * Assert specific learning path card is visible
     * @param {string} pathName - The learning path name
     */
    async expectLearningPathCardVisible(pathName) {
        const card = this.getLearningPathCard(pathName);
        await this.expectVisible(card);
    }

    /**
     * Assert all filter elements are visible
     */
    async expectAllFiltersVisible() {
        await this.expectTopicDropdownVisible();
        await this.expectPathSizeDropdownVisible();
        await this.expectSearchInputVisible();
    }

    /**
     * Assert all footer links are visible
     */
    async expectAllFooterLinksVisible() {
        await this.footer.expectAllFooterLinksVisible();
    }

    // --- Modal Assertions ---

    /**
     * Assert modal is visible
     */
    async expectModalVisible() {
        await this.expectVisible(this.modal);
    }

    /**
     * Assert modal title matches expected text
     * @param {string} expectedTitle - Expected modal title
     */
    async expectModalTitle(expectedTitle) {
        await this.expectText(this.modalTitle, expectedTitle);
    }

    /**
     * Assert modal courses count is visible
     */
    async expectModalCoursesCountVisible() {
        await this.expectVisible(this.modalCoursesCount);
    }

    /**
     * Assert modal duration is visible
     */
    async expectModalDurationVisible() {
        await this.expectVisible(this.modalDuration);
    }

    /**
     * Assert "See Learning Path" link is visible
     */
    async expectSeeLearningPathLinkVisible() {
        await this.expectVisible(this.modalSeeLearningPathLink);
    }

    /**
     * Assert "Remove from Classroom" button is visible
     */
    async expectRemoveFromClassroomBtnVisible() {
        await this.expectVisible(this.modalRemoveFromClassroomBtn);
    }

    /**
     * Assert modal close button is visible
     */
    async expectModalCloseButtonVisible() {
        await this.expectVisible(this.modalCloseButton);
    }

    /**
     * Assert all modal elements are visible
     * @param {string} expectedTitle - Expected modal title
     */
    async expectAllModalElementsVisible(expectedTitle) {
        await this.expectModalVisible();
        await this.expectModalTitle(expectedTitle);
        await this.expectModalCoursesCountVisible();
        await this.expectModalDurationVisible();
        await this.expectSeeLearningPathLinkVisible();
        await this.expectModalCloseButtonVisible();
    }

    /**
     * Assert modal is closed/hidden
     */
    async expectModalHidden() {
        await this.expectHidden(this.modal);
    }
}

module.exports = StudentLearningPathsPage;
