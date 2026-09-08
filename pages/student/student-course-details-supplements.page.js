const BasePage = require('../base.page');
const StudentNavigationPage = require('./student-navigation.page');
const StudentFooterPage = require('./student-footer.page');

/**
 * StudentCourseDetailsSupplementsPage - Course details page with supplements
 * Tests the Python Foundations course which has supplements section
 * URL: /stormwind-developer/python/python-foundations
 */
class StudentCourseDetailsSupplementsPage extends BasePage {
    constructor(page) {
        super(page);

        // Compose shared components
        this.navigation = new StudentNavigationPage(page);
        this.footer = new StudentFooterPage(page);

        // Hero Banner
        this.heroBanner = page.locator('.course-hero, [class*="hero"], .banner').first();
        this.heroCategory = page.locator('.letter-spacing-lg').filter({ hasText: 'Python' });
        this.heroTitle = page.getByRole('heading', { name: 'Python Foundations' }).first();
        this.heroLevel = page.locator('.course-hero, .banner').getByText('Beginner');
        this.heroDuration = page.locator('.course-hero, .banner').getByText('10 hours');
        this.heroInstructor = page.locator('.course-hero, .banner').getByText('By: Edem Francois');

        // Banner buttons
        this.addToClassroomBtn = page.getByRole('button', { name: /ADD TO CLASSROOM/i });
        this.viewPreviewBtn = page.locator('a.js-course-preview-link');

        // Storm AI Tutor button
        this.stormAITutorBtn = page.locator('#stormAIButton');
        this.stormAITutorText = page.locator('.storm-ai-text');

        // Supplements section
        this.supplementsContainer = page.locator('.course-supplements');
        this.supplementsHeading = page.locator('.course-supplements h6');
        this.supplementsIcon = page.locator('.course-supplements i.fa-folder-open');
        this.supplementsCounter = page.locator('.supplements-counter');
        this.supplementsList = page.locator('.course-supplements ul.list-group');

        // Supplement links - scoped to supplements container
        this.classSlidesLink = this.supplementsContainer.locator('li.list-group-item').filter({ hasText: 'Class Slides' });
        this.codeSamplesLink = this.supplementsContainer.locator('li.list-group-item').filter({ hasText: 'Python Foundations Code Samples' });

        // Overview section
        this.overviewHeading = page.getByRole('heading', { name: 'Overview' });

        // Modules section
        this.modulesHeading = page.locator('h5.overview').filter({ hasText: 'Modules' });
    }

    /**
     * Navigate to Python Foundations course page
     */
    async goto() {
        await this.page.goto('/stormwind-developer/python/python-foundations');
        await this.page.waitForLoadState('domcontentloaded');
    }

    /**
     * Check if on correct URL
     */
    async isOnCorrectURL() {
        const url = this.page.url();
        return url.includes('/stormwind-developer/python/python-foundations');
    }

    /**
     * Get supplements count from badge
     */
    async getSupplementsCount() {
        const text = await this.supplementsCounter.textContent();
        return parseInt(text, 10);
    }

    // --- Assertions ---

    /**
     * Assert navigation bar is visible
     */
    async expectNavigationVisible() {
        await this.navigation.expectMainNavVisible();
    }

    /**
     * Assert hero category is visible
     */
    async expectHeroCategoryVisible() {
        await this.expectVisible(this.heroCategory);
    }

    /**
     * Assert hero title is visible
     */
    async expectHeroTitleVisible() {
        await this.expectVisible(this.heroTitle);
    }

    /**
     * Assert hero level is visible
     */
    async expectHeroLevelVisible() {
        await this.expectVisible(this.heroLevel);
    }

    /**
     * Assert hero duration is visible
     */
    async expectHeroDurationVisible() {
        await this.expectVisible(this.heroDuration);
    }

    /**
     * Assert hero instructor is visible
     */
    async expectHeroInstructorVisible() {
        await this.expectVisible(this.heroInstructor);
    }

    /**
     * Assert ADD TO CLASSROOM button is visible
     */
    async expectAddToClassroomBtnVisible() {
        await this.expectVisible(this.addToClassroomBtn);
    }

    /**
     * Assert VIEW PREVIEW button is visible
     */
    async expectViewPreviewBtnVisible() {
        await this.expectVisible(this.viewPreviewBtn);
    }

    /**
     * Assert all hero banner elements are visible
     */
    async expectHeroBannerComplete() {
        await this.expectHeroCategoryVisible();
        await this.expectHeroTitleVisible();
        await this.expectHeroLevelVisible();
        await this.expectHeroDurationVisible();
        await this.expectHeroInstructorVisible();
        await this.expectAddToClassroomBtnVisible();
        await this.expectViewPreviewBtnVisible();
    }

    /**
     * Assert Storm AI Tutor button is visible
     */
    async expectStormAITutorBtnVisible() {
        await this.expectVisible(this.stormAITutorBtn);
    }

    /**
     * Assert Storm AI Tutor text is visible
     */
    async expectStormAITutorTextVisible() {
        await this.expectVisible(this.stormAITutorText);
    }

    /**
     * Assert Supplements section is visible
     */
    async expectSupplementsSectionVisible() {
        await this.expectVisible(this.supplementsContainer);
        await this.expectVisible(this.supplementsHeading);
    }

    /**
     * Assert Supplements counter is visible with count
     */
    async expectSupplementsCounterVisible() {
        await this.expectVisible(this.supplementsCounter);
    }

    /**
     * Assert Class Slides link is visible
     */
    async expectClassSlidesLinkVisible() {
        await this.expectVisible(this.classSlidesLink);
    }

    /**
     * Assert Code Samples link is visible
     */
    async expectCodeSamplesLinkVisible() {
        await this.expectVisible(this.codeSamplesLink);
    }

    /**
     * Assert all supplements elements are visible
     */
    async expectAllSupplementsVisible() {
        await this.expectSupplementsSectionVisible();
        await this.expectSupplementsCounterVisible();
        await this.expectClassSlidesLinkVisible();
        await this.expectCodeSamplesLinkVisible();
    }

    /**
     * Assert Overview section is visible
     */
    async expectOverviewSectionVisible() {
        await this.expectVisible(this.overviewHeading);
    }

    /**
     * Assert Modules section is visible
     */
    async expectModulesSectionVisible() {
        await this.expectVisible(this.modulesHeading);
    }

    /**
     * Assert all footer links are visible
     */
    async expectAllFooterLinksVisible() {
        await this.footer.expectAllFooterLinksVisible();
    }
}

module.exports = StudentCourseDetailsSupplementsPage;
