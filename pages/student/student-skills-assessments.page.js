const BasePage = require('../base.page');
const StudentNavigationPage = require('./student-navigation.page');
const StudentFooterPage = require('./student-footer.page');

/**
 * StudentSkillsAssessmentsPage - Skills Assessments tab page object
 * Uses composition with shared navigation and footer components
 * URL: /skillsassessment
 */
class StudentSkillsAssessmentsPage extends BasePage {
    constructor(page) {
        super(page);

        // Compose shared components
        this.navigation = new StudentNavigationPage(page);
        this.footer = new StudentFooterPage(page);

        this.pageHeading = page.getByRole('heading', { name: 'Skills Assessment' });
        this.searchInput = page.locator('#edit-search-api-fulltext');

        this.assessmentCards = page.locator('.course-card.sw-card--skills-assessment');

        // Card title (for finding specific cards)
        this.cardTitle = page.locator('.course-card__title');

        // Modal elements - based on actual HTML structure
        // Modal ID pattern: #course-preview__modal--{nodeId}
        this.modal = page.locator('[id^="course-preview__modal"].show, .modal.show');
        this.modalContainer = page.locator('.modal.show .modal-content');
        this.modalTitle = page.locator('.modal.show .modal-title, .modal.show h5').first();
        this.modalLevel = page.locator('.modal.show').getByText(/beginner|intermediate|advanced/i).first();
        this.modalDuration = page.locator('.modal.show').getByText(/less than|hour|minute/i).first();
        this.modalOverviewHeading = page.locator('.modal.show h5:has-text("Overview"), .modal.show h4:has-text("Overview")');
        this.modalGoToAssessmentLink = page.locator('.modal.show').getByRole('link', { name: /go to assessment/i });
        this.modalAddToClassroomBtn = page.locator('.modal.show').getByRole('button', { name: /add to classroom/i });
        this.modalCloseButton = page.locator('.modal.show [data-dismiss="modal"], .modal.show button[aria-label="Close"]').first();
    }

    /**
     * Navigate to Skills Assessments page via navigation menu
     */
    async goto() {
        await this.navigation.navigateToSkillsAssessments();
        await this.page.locator('.skills-assessment-page__loading').waitFor({ state: 'hidden', timeout: 15000 }).catch(() => {});
    }

    /**
     * Check if Skills Assessments page is displayed
     * @returns {Promise<boolean>}
     */
    async isSkillsAssessmentsPageDisplayed() {
        return await this.pageHeading.isVisible();
    }

    /**
     * Check if on correct URL
     * @returns {Promise<boolean>}
     */
    async isOnCorrectURL() {
        return this.page.url().includes('/skillsassessment');
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
     * Search for an assessment by name
     * @param {string} assessmentName - The assessment name to search for
     */
    async searchAssessment(assessmentName) {
        await this.searchInput.click();
        await this.searchInput.fill(assessmentName);
        await this.searchInput.press('Enter');
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.locator('.skills-assessment-page__loading').waitFor({ state: 'hidden', timeout: 15000 }).catch(() => {});
    }

    /**
     * Clear the search input
     */
    async clearSearch() {
        await this.searchInput.clear();
    }

    // --- Assessment Card Methods ---

    /**
     * Get count of assessment cards displayed
     * @returns {Promise<number>}
     */
    async getAssessmentsCount() {
        return await this.assessmentCards.count();
    }

    /**
     * Get a specific assessment card by name using the card title
     * @param {string} assessmentName - The assessment name
     * @returns {Locator}
     */
    getAssessmentCard(assessmentName) {
        return this.page.locator('.course-card__title').filter({ hasText: assessmentName });
    }

    /**
     * Check if a specific assessment card is visible
     * @param {string} assessmentName - The assessment name
     * @returns {Promise<boolean>}
     */
    async isAssessmentCardVisible(assessmentName) {
        const card = this.getAssessmentCard(assessmentName);
        return await card.isVisible();
    }

    /**
     * Wait for a specific assessment card to be visible after search
     * @param {string} assessmentName - The assessment name to wait for
     */
    async waitForAssessmentCard(assessmentName) {
        const card = this.getAssessmentCard(assessmentName);
        await card.waitFor({ state: 'visible', timeout: 30000 });
    }

    /**
     * Click on a specific assessment card to open modal
     * @param {string} assessmentName - The assessment name to click
     */
    async clickAssessment(assessmentName) {
        // Click on the modal-toggle button inside the card
        const cardButton = this.page.locator('button.modal-toggle').filter({ hasText: assessmentName });
        await cardButton.click();
        // Wait for modal to be visible
        await this.modal.waitFor({ state: 'visible' });
    }

    // --- Modal Methods ---

    /**
     * Open assessment modal by clicking on card name
     * @param {string} assessmentName - The assessment name
     */
    async openAssessmentModal(assessmentName) {
        await this.clickAssessment(assessmentName);
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
     * Assert search input is visible
     */
    async expectSearchInputVisible() {
        await this.expectVisible(this.searchInput);
    }

    /**
     * Assert assessment cards are visible
     */
    async expectAssessmentCardsVisible() {
        await this.page.locator('.skills-assessment-page__loading').waitFor({ state: 'hidden', timeout: 15000 }).catch(() => {});
        await this.assessmentCards.first().waitFor({ state: 'visible', timeout: 10000 });
        const count = await this.getAssessmentsCount();
        if (count === 0) {
            throw new Error('No assessment cards found');
        }
    }

    /**
     * Assert specific assessment card is visible
     * @param {string} assessmentName - The assessment name
     */
    async expectAssessmentCardVisible(assessmentName) {
        const card = this.getAssessmentCard(assessmentName);
        await this.expectVisible(card);
    }

    /**
     * Assert navigation bar is visible
     */
    async expectNavigationVisible() {
        await this.navigation.expectMainNavVisible();
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
     * Assert modal level is visible
     */
    async expectModalLevelVisible() {
        await this.expectVisible(this.modalLevel);
    }

    /**
     * Assert modal duration is visible
     */
    async expectModalDurationVisible() {
        await this.expectVisible(this.modalDuration);
    }

    /**
     * Assert modal overview heading is visible
     */
    async expectModalOverviewVisible() {
        await this.expectVisible(this.modalOverviewHeading);
    }

    /**
     * Assert GO TO ASSESSMENT link is visible
     */
    async expectGoToAssessmentLinkVisible() {
        await this.expectVisible(this.modalGoToAssessmentLink);
    }

    /**
     * Assert Add To Classroom button is visible
     */
    async expectAddToClassroomBtnVisible() {
        await this.expectVisible(this.modalAddToClassroomBtn);
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
        await this.expectModalLevelVisible();
        await this.expectModalDurationVisible();
        await this.expectModalOverviewVisible();
        await this.expectGoToAssessmentLinkVisible();
        await this.expectAddToClassroomBtnVisible();
        await this.expectModalCloseButtonVisible();
    }

    /**
     * Assert modal is closed/hidden
     */
    async expectModalHidden() {
        await this.expectHidden(this.modal);
    }
}

module.exports = StudentSkillsAssessmentsPage;
