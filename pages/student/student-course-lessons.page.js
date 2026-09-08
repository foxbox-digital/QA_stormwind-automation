const BasePage = require('../base.page');
const StudentNavigationPage = require('./student-navigation.page');
const StudentFooterPage = require('./student-footer.page');

/**
 * StudentCourseLessonsPage - Course lessons/player page
 * Tests the course player page after clicking Resume/Start
 * URL: /replay/{courseId}/course-overview
 */
class StudentCourseLessonsPage extends BasePage {
    constructor(page) {
        super(page);

        // Compose shared components
        this.navigation = new StudentNavigationPage(page);
        this.footer = new StudentFooterPage(page);

        // Page header
        this.pageHeader = page.locator('.learning-object__header, header').first();
        this.introductionLabel = page.getByText('INTRODUCTION');
        this.courseOverviewHeading = page.locator('#learning-object__title').filter({ hasText: 'Course Overview' });

        // Main content area with course title
        this.courseTitle = page.getByRole('heading', { name: 'Microsoft Azure for .NET Developers' });

        // Table of Contents sidebar
        this.tableOfContents = page.locator('.learning-object__table-of-contents');
        this.tocHeading = page.locator('h2').filter({ hasText: 'Table of content' });
        this.tocIcon = page.locator('i.fas.fa-list');
        this.tocSections = page.locator('.learning-object_table-of-contents_sections, .learning-object__table-of-contents section');

        // Module names in TOC (all 13 modules)
        this.moduleNames = [
            'Introduction',
            'Get Started with Microsoft Azure',
            'Azure Resource Manager',
            'Azure App Service',
            'Azure SQL',
            'Azure Cosmos DB',
            'Azure Storage Accounts',
            'Azure Service Bus',
            'Azure Functions (Serverless Solutions)',
            'Azure Virtual Machines',
            'Azure Containers',
            'Microsoft Azure Active Directory',
            'Conclusion'
        ];

        // Module items (clickable to expand)
        this.moduleItems = page.locator('.learning-object__table-of-contents [class*="module"], .learning-object__table-of-contents [class*="section-title"], .learning-object__table-of-contents [class*="accordion"]');

        // Lesson items (appear when module is expanded)
        // Structure: <li class="list-group-item d-flex align-items-center">
        this.lessonItems = page.locator('.learning-object__table-of-contents li.list-group-item');
        // Play icons: <i class="fal fa-play-circle">
        this.lessonPlayIcons = page.locator('.learning-object__table-of-contents i.fal.fa-play-circle');
        this.lessonTitles = page.locator('.learning-object__table-of-contents h4.lesson_title');
        this.lessonDurations = page.locator('.learning-object__table-of-contents span.lesson_duration');

        // Supplements section (below TOC)
        // Container: <div class="course-supplements mt-3 d-none d-md-block">
        this.supplementsSection = page.locator('.course-supplements');
        this.supplementsHeading = page.locator('.course-supplements h2').filter({ hasText: 'Supplements' });
        this.supplementsIcon = page.locator('.course-supplements i.fal.fa-folders');
        this.supplementsCounter = page.locator('.course-supplements .supplements-counter');
        this.supplementsGitHubLink = page.getByText('Microsoft Azure for .NET Developers GitHub');

        // Request Mentoring button
        // Structure: <a class="use-ajax btn btn-outline-secondary w-100 button js-form-submit form-submit request-mentoring-button">
        this.requestMentoringBtn = page.locator('a.request-mentoring-button');
    }

    /**
     * Navigate to a specific course lessons page
     * @param {string} url - Full URL or path
     */
    async goto(url = '/replay/106477/course-overview') {
        await this.page.goto(url);
        await this.page.waitForLoadState('domcontentloaded');
    }

    /**
     * Check if current URL contains the expected replay path
     * @param {string} expectedPath - Expected path segment
     * @returns {boolean}
     */
    async isOnLessonsPage(expectedPath = '/replay/106477/course-overview') {
        const url = this.page.url();
        return url.includes(expectedPath);
    }

    /**
     * Check if TOC contains all expected module names
     * @returns {Promise<boolean>}
     */
    async hasAllModules() {
        const tocText = await this.tableOfContents.textContent();
        return this.moduleNames.every(moduleName => tocText.includes(moduleName));
    }

    /**
     * Get missing modules from TOC
     * @returns {Promise<string[]>}
     */
    async getMissingModules() {
        const tocText = await this.tableOfContents.textContent();
        return this.moduleNames.filter(moduleName => !tocText.includes(moduleName));
    }

    /**
     * Click on a module to expand it
     * @param {string} moduleName - Name of the module to click
     */
    async clickModule(moduleName) {
        const moduleElement = this.tableOfContents.getByText(moduleName, { exact: false }).first();
        await moduleElement.click();
        // Wait for expansion animation
        await this.page.waitForTimeout(500);
    }

    /**
     * Get visible lessons count after expanding a module
     * @returns {Promise<number>}
     */
    async getVisibleLessonsCount() {
        return await this.lessonItems.count();
    }

    /**
     * Check if lessons have play icons
     * @returns {Promise<boolean>}
     */
    async lessonsHavePlayIcons() {
        const playIconCount = await this.lessonPlayIcons.count();
        return playIconCount > 0;
    }

    /**
     * Scroll TOC to bottom to see Supplements and Request Mentoring
     */
    async scrollTocToBottom() {
        await this.tableOfContents.evaluate(el => {
            el.scrollTop = el.scrollHeight;
        });
        await this.page.waitForTimeout(300);
    }

    // --- Assertions ---

    /**
     * Assert navigation bar is visible
     */
    async expectNavigationVisible() {
        await this.navigation.expectMainNavVisible();
    }

    /**
     * Assert page header elements are visible
     */
    async expectPageHeaderVisible() {
        await this.expectVisible(this.courseOverviewHeading);
    }

    /**
     * Assert course title is visible
     */
    async expectCourseTitleVisible() {
        await this.expectVisible(this.courseTitle);
    }

    /**
     * Assert Table of Contents is visible
     */
    async expectTocVisible() {
        await this.expectVisible(this.tableOfContents);
        await this.expectVisible(this.tocHeading);
    }

    /**
     * Assert all modules exist in TOC (by text content, no scroll needed)
     */
    async expectAllModulesInToc() {
        const tocText = await this.tableOfContents.textContent();
        for (const moduleName of this.moduleNames) {
            if (!tocText.includes(moduleName)) {
                throw new Error(`Module "${moduleName}" not found in Table of Contents`);
            }
        }
    }

    /**
     * Assert lessons are visible after expanding a module
     */
    async expectLessonsVisible() {
        const count = await this.getVisibleLessonsCount();
        if (count === 0) {
            throw new Error('No lessons visible after expanding module');
        }
    }

    /**
     * Assert lessons have play icons
     */
    async expectLessonsHavePlayIcons() {
        const hasIcons = await this.lessonsHavePlayIcons();
        if (!hasIcons) {
            throw new Error('Lessons do not have play icons');
        }
    }

    /**
     * Assert Supplements section is visible
     */
    async expectSupplementsSectionVisible() {
        await this.scrollTocToBottom();
        await this.expectVisible(this.supplementsHeading);
    }

    /**
     * Assert Supplements GitHub link is visible
     */
    async expectSupplementsGitHubLinkVisible() {
        await this.expectVisible(this.supplementsGitHubLink);
    }

    /**
     * Assert Request Mentoring button is visible
     */
    async expectRequestMentoringBtnVisible() {
        await this.expectVisible(this.requestMentoringBtn);
    }

    /**
     * Assert all footer links are visible
     */
    async expectAllFooterLinksVisible() {
        await this.footer.expectAllFooterLinksVisible();
    }

    /**
     * Complete validation of lessons page
     */
    async expectLessonsPageComplete() {
        await this.expectNavigationVisible();
        await this.expectPageHeaderVisible();
        await this.expectCourseTitleVisible();
        await this.expectTocVisible();
        await this.expectAllModulesInToc();
        await this.expectSupplementsSectionVisible();
        await this.expectSupplementsGitHubLinkVisible();
        await this.expectRequestMentoringBtnVisible();
        await this.expectAllFooterLinksVisible();
    }
}

module.exports = StudentCourseLessonsPage;
