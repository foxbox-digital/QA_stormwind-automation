const BasePage = require('../base.page');
const StudentNavigationPage = require('./student-navigation.page');
const StudentFooterPage = require('./student-footer.page');

/**
 * StudentCoursesListPage - Courses List page after selecting a topic category
 * Uses composition with shared navigation and footer components
 * URL: /courses/{topicId} (e.g., /courses/170394 for Cybersecurity)
 *
 * Stage 2: Topic landing page with subcategory chips and filters
 */
class StudentCoursesListPage extends BasePage {
    constructor(page) {
        super(page);

        // Compose shared components
        this.navigation = new StudentNavigationPage(page);
        this.footer = new StudentFooterPage(page);

        // Breadcrumb - scoped to main container to avoid nav/footer conflicts
        this.breadcrumb = page.locator('nav[aria-label="breadcrumb"], .breadcrumb');
        this.breadcrumbCourses = page.locator('#main_container').getByRole('link', { name: 'Courses' });

        // Page heading (topic name)
        this.pageHeading = page.locator('h1');

        // Search box
        this.searchInput = page.getByPlaceholder('What do you want to learn today?');

        // Subcategory chips/tags container
        this.chipsContainer = page.locator('ul.topic-card__tags');
        this.chips = page.locator('li.topic-card__tag');
        this.activeChip = page.locator('li.topic-card__tag.active');

        // Individual subcategory chips (Cybersecurity specific)
        this.chipAll = page.locator('li.topic-card__tag[data-id="all"]');
        this.chipCompTIA = page.locator('li.topic-card__tag').filter({ hasText: 'CompTIA' });
        this.chipCyberRange = page.locator('li.topic-card__tag').filter({ hasText: 'Cyber Range' });
        this.chipECCouncil = page.locator('li.topic-card__tag').filter({ hasText: 'EC-Council' });
        this.chipISC2 = page.locator('li.topic-card__tag').filter({ hasText: 'ISC2' });
        this.chipMicrosoft = page.locator('li.topic-card__tag').filter({ hasText: 'Microsoft' });
        this.chipPM = page.locator('li.topic-card__tag').filter({ hasText: 'PM' });
        this.chipPaloAlto = page.locator('li.topic-card__tag').filter({ hasText: 'Palo Alto' });
        this.chipSonicWall = page.locator('li.topic-card__tag').filter({ hasText: 'SonicWall' });
        this.chipWebinars = page.locator('li.topic-card__tag').filter({ hasText: 'Webinars' });

        // Filters sidebar - use heading role to be more specific
        this.filtersHeading = page.getByRole('heading', { name: 'Filters' }).first();
        this.filterDifficulty = page.locator('button, div').filter({ hasText: 'Difficulty' }).first();
        this.filterJobRole = page.locator('button, div').filter({ hasText: 'Job Role' }).first();
        this.filterInstructor = page.locator('button, div').filter({ hasText: 'Instructor' }).first();
        this.filterCourseType = page.locator('button, div').filter({ hasText: 'Course Type' }).first();
        this.filterCertificationBased = page.locator('button, div').filter({ hasText: 'Certification-Based' }).first();
        this.filterTopic = page.locator('button, div').filter({ hasText: 'Topic' }).first();

        // Exclude condensed cards — those live in a hidden featured_courses section in Drupal 11
        this.courseCards = page.locator('.course-card:not(.course-card--condensed)');
        this.courseCardTitles = page.locator('.course-card__title');
        this.courseCardTitleLinks = page.locator('button.modal-toggle');

        // Course Preview Modal - uses .course-preview-modal.modal.fade.show
        this.courseModal = page.locator('.course-preview-modal.show');
        this.courseModalTitle = page.locator('#modalLabel');
        this.courseModalInstructor = page.locator('.course-preview-modal.show').getByText('By:');
        this.courseModalLevel = page.locator('.course-preview-modal.show').getByText(/Intermediate|Beginner|Advanced/);
        this.courseModalDuration = page.locator('.course-preview-modal.show').getByText('less than 1 hour');
        this.courseModalOverviewHeading = page.locator('.course-preview-modal.show').getByText('Overview', { exact: true });
        // The preview modal's CTA reads "Go to Course" for courses and "Go to Assessment" for assessment items (both can appear in a course list).
        this.courseModalGoToLink = page.locator('.course-preview-modal.show').getByRole('link', { name: /go to (course|assessment)/i });
        this.courseModalAddToClassroomBtn = page.locator('.course-preview-modal.show').getByRole('button', { name: /ADD TO CLASSROOM/i });
        this.courseModalCloseButton = page.locator('.course-preview-modal.show button.close, .course-preview-modal.show [aria-label="Close"]');
    }

    // --- Navigation Methods ---

    /**
     * Click on a subcategory chip by name
     * @param {string} chipName - The chip name to click (e.g., 'Palo Alto', 'CompTIA')
     */
    async clickChip(chipName) {
        const chip = this.page.locator('li.topic-card__tag').filter({ hasText: chipName });
        await chip.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    /**
     * Click on the "All" chip to show all courses
     */
    async clickAllChip() {
        await this.chipAll.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    /**
     * Click on Palo Alto chip
     */
    async clickPaloAltoChip() {
        await this.dismissNotificationPopup();
        await this.chipPaloAlto.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    /**
     * Get the currently active chip text
     * @returns {Promise<string>}
     */
    async getActiveChipText() {
        return await this.activeChip.textContent();
    }

    /**
     * Check if a specific chip is active
     * @param {string} chipName - The chip name to check
     * @returns {Promise<boolean>}
     */
    async isChipActive(chipName) {
        const chip = this.page.locator('li.topic-card__tag.active').filter({ hasText: chipName });
        return await chip.isVisible();
    }

    /**
     * Get count of visible course cards
     * @returns {Promise<number>}
     */
    async getCourseCardsCount() {
        await this.courseCards.first().waitFor({ state: 'visible', timeout: 10000 });
        return await this.courseCards.count();
    }

    /**
     * Get all chip names
     * @returns {Promise<string[]>}
     */
    async getAllChipNames() {
        const chips = await this.chips.allTextContents();
        return chips.map(chip => chip.trim());
    }

    /**
     * Click on a course card by title
     * @param {string} courseTitle - The course title to click
     */
    async clickCourseCard(courseTitle) {
        const card = this.page.locator('.course-card, [class*="course-card"]').filter({ hasText: courseTitle });
        await card.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    /**
     * Click on a course card title link to open modal
     * @param {string} courseTitle - The course title link to click
     */
    async clickCourseCardTitleLink(courseTitle) {
        await this.dismissNotificationPopup();
        const titleLink = this.page.locator('button.modal-toggle').filter({ hasText: courseTitle });
        await titleLink.click();
        await this.courseModal.waitFor({ state: 'visible', timeout: 10000 });
    }

    /**
     * Click on the first actual course (not a skills assessment) to open modal
     * Skills assessments contain "Skills Assessment" text, courses contain "By:" for instructor
     * @returns {Promise<string>} The title of the course clicked
     */
    async clickFirstActualCourse() {
        // Find course cards that have "By:" text (indicating an instructor, meaning it's a course not a skills assessment)
        const courseCardsWithInstructor = this.page.locator('a.course-meta__title').filter({
            has: this.page.locator('xpath=ancestor::div[contains(@class, "course-card")]//span[contains(text(), "By:")]')
        });

        // If no courses with instructor found, try clicking the first course that's not a skills assessment
        const allCourseLinks = this.page.locator('a.course-meta__title');
        const count = await allCourseLinks.count();

        for (let i = 0; i < count; i++) {
            const link = allCourseLinks.nth(i);
            const card = link.locator('xpath=ancestor::div[contains(@class, "course-card") or contains(@class, "course-meta")]');
            const cardText = await card.textContent();

            // Skip skills assessments
            if (!cardText.includes('Skills Assessment')) {
                const title = await link.textContent();
                await link.click();
                await this.courseModal.waitFor({ state: 'visible', timeout: 10000 });
                return title.trim();
            }
        }

        // Fallback: click first course link anyway
        const firstLink = allCourseLinks.first();
        const title = await firstLink.textContent();
        await firstLink.click();
        await this.courseModal.waitFor({ state: 'visible', timeout: 10000 });
        return title.trim();
    }

    /**
     * Close the course modal
     */
    async closeCourseModal() {
        await this.courseModalCloseButton.click();
        await this.courseModal.waitFor({ state: 'hidden', timeout: 5000 });
    }

    /**
     * Get the course modal title text
     * @returns {Promise<string>}
     */
    async getCourseModalTitleText() {
        return await this.courseModalTitle.textContent();
    }

    // --- Assertions ---

    /**
     * Assert page heading matches expected topic name
     * @param {string} topicName - Expected topic name (e.g., 'Cybersecurity')
     */
    async expectPageHeading(topicName) {
        await this.expectVisible(this.pageHeading);
        await this.expectText(this.pageHeading, topicName);
    }

    /**
     * Assert breadcrumb is visible
     */
    async expectBreadcrumbVisible() {
        await this.expectVisible(this.breadcrumbCourses);
    }

    /**
     * Assert search input is visible
     */
    async expectSearchInputVisible() {
        await this.expectVisible(this.searchInput);
    }

    /**
     * Assert chips container is visible
     */
    async expectChipsVisible() {
        await this.expectVisible(this.chipsContainer);
    }

    /**
     * Assert all Cybersecurity subcategory chips are visible
     */
    async expectAllCybersecurityChipsVisible() {
        await this.expectVisible(this.chipAll);
        await this.expectVisible(this.chipCompTIA);
        await this.expectVisible(this.chipCyberRange);
        await this.expectVisible(this.chipECCouncil);
        await this.expectVisible(this.chipISC2);
        await this.expectVisible(this.chipMicrosoft);
        await this.expectVisible(this.chipPM);
        await this.expectVisible(this.chipPaloAlto);
        await this.expectVisible(this.chipSonicWall);
        await this.expectVisible(this.chipWebinars);
    }

    /**
     * Assert Filters heading is visible
     */
    async expectFiltersHeadingVisible() {
        await this.expectVisible(this.filtersHeading);
    }

    /**
     * Assert all filter options are visible
     */
    async expectAllFiltersVisible() {
        await this.expectVisible(this.filterDifficulty);
        await this.expectVisible(this.filterJobRole);
        await this.expectVisible(this.filterInstructor);
        await this.expectVisible(this.filterCourseType);
        await this.expectVisible(this.filterCertificationBased);
    }

    /**
     * Assert course cards are visible
     */
    async expectCourseCardsVisible() {
        await this.dismissNotificationPopup();
        await this.courseCards.first().waitFor({ state: 'visible', timeout: 30000 });
        const count = await this.getCourseCardsCount();
        if (count === 0) {
            throw new Error('No course cards found');
        }
    }

    /**
     * Assert a specific chip is active
     * @param {string} chipName - The chip name that should be active
     */
    async expectChipActive(chipName) {
        const isActive = await this.isChipActive(chipName);
        if (!isActive) {
            throw new Error(`Expected chip "${chipName}" to be active but it was not`);
        }
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

    /**
     * Assert exact number of course cards are displayed
     * @param {number} expectedCount - Expected number of course cards
     */
    async expectCourseCardsCount(expectedCount) {
        await this.courseCards.first().waitFor({ state: 'visible', timeout: 10000 });
        const count = await this.getCourseCardsCount();
        if (count !== expectedCount) {
            throw new Error(`Expected ${expectedCount} course cards but found ${count}`);
        }
    }

    /**
     * Assert course modal is visible
     */
    async expectCourseModalVisible() {
        await this.expectVisible(this.courseModal);
    }

    /**
     * Assert course modal title matches expected text
     * @param {string} expectedTitle - Expected modal title
     */
    async expectCourseModalTitle(expectedTitle) {
        await this.expectVisible(this.courseModalTitle);
        const titleText = await this.getCourseModalTitleText();
        if (!titleText.includes(expectedTitle)) {
            throw new Error(`Expected modal title to contain "${expectedTitle}" but got "${titleText}"`);
        }
    }

    /**
     * Assert course modal instructor label is visible
     */
    async expectCourseModalInstructorVisible() {
        await this.expectVisible(this.courseModalInstructor);
    }

    /**
     * Assert course modal level is visible
     */
    async expectCourseModalLevelVisible() {
        await this.expectVisible(this.courseModalLevel);
    }

    /**
     * Assert course modal duration is visible
     */
    async expectCourseModalDurationVisible() {
        await this.expectVisible(this.courseModalDuration);
    }

    /**
     * Assert course modal Overview heading is visible
     */
    async expectCourseModalOverviewHeadingVisible() {
        await this.expectVisible(this.courseModalOverviewHeading);
    }

    /**
     * Assert course modal "Go to Course" / "Go to Assessment" link is visible
     */
    async expectCourseModalGoToLinkVisible() {
        await this.expectVisible(this.courseModalGoToLink);
    }

    /**
     * Assert course modal ADD TO CLASSROOM button is visible
     */
    async expectCourseModalAddToClassroomBtnVisible() {
        await this.expectVisible(this.courseModalAddToClassroomBtn);
    }

    /**
     * Assert course modal close button is visible
     */
    async expectCourseModalCloseButtonVisible() {
        await this.expectVisible(this.courseModalCloseButton);
    }

    /**
     * Assert all course modal elements are visible
     * @param {string} expectedTitle - Expected modal title
     */
    async expectAllCourseModalElementsVisible(expectedTitle) {
        await this.expectCourseModalVisible();
        await this.expectCourseModalTitle(expectedTitle);
        await this.expectCourseModalInstructorVisible();
        await this.expectCourseModalLevelVisible();
        await this.expectCourseModalDurationVisible();
        await this.expectCourseModalOverviewHeadingVisible();
        await this.expectCourseModalGoToLinkVisible();
        await this.expectCourseModalAddToClassroomBtnVisible();
        await this.expectCourseModalCloseButtonVisible();
    }
}

module.exports = StudentCoursesListPage;
