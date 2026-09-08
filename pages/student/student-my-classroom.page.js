const BasePage = require('../base.page');
const StudentNavigationPage = require('./student-navigation.page');
const StudentFooterPage = require('./student-footer.page');
const URLS = require('../../data/urls');

/**
 * StudentMyClassroomPage - My Classroom tab page object
 * Uses composition with shared navigation and footer components
 */
class StudentMyClassroomPage extends BasePage {
    constructor(page) {
        super(page);

        // Compose shared components
        this.navigation = new StudentNavigationPage(page);
        this.footer = new StudentFooterPage(page);

        // Page-specific elements
        this.welcomeMessage = page.getByText(/Welcome back,/);

        // Content tabs within My Classroom
        this.coursesTab = page.getByRole('tab', { name: 'Courses' });
        this.learningPathsTab = page.getByRole('tab', { name: 'Learning Paths' });
        this.skillsAssessmentTab = page.getByRole('tab', { name: 'Skills Assessment' });

        // Featured course card (top of page)
        this.featuredResumeBtn = page.getByRole('link', { name: /RESUME/i }).first();
        this.featuredSeeDetailsBtn = page.getByRole('link', { name: /SEE COURSE DETAILS/i }).first();

        // Filter pills
        this.allFilterPill = page.getByRole('button', { name: /^All/i }).first();
        this.inProgressFilterPill = page.getByRole('button', { name: /In progress/i }).first();
        this.completedFilterPill = page.getByRole('button', { name: /^Completed/i }).first();

        // Overdue badge (visible on overdue course cards). The badge only renders
        // when the account actually has an overdue course, so tests must guard on
        // overdueBadgeCount() before asserting visibility.
        this.overdueBadges = page.locator('.deadline-badge--overdue');
        this.overdueBadge = this.overdueBadges.first();

        // Course content
        this.coursesList = page.locator('.courses-list');
        this.courseCards = page.locator('.course-card');
    }

    async goto() {
        await this.navigate(URLS.STUDENT.MY_CLASSROOM);
    }

    async navigateFromNav() {
        await this.navigation.navigateToMyClassroom();
    }

    // Tab interactions
    async clickCoursesTab() {
        await this.coursesTab.click();
    }

    async clickLearningPathsTab() {
        await this.learningPathsTab.click();
    }

    async clickSkillsAssessmentTab() {
        await this.skillsAssessmentTab.click();
    }

    // Course interactions
    async getCoursesCount() {
        return await this.courseCards.count();
    }

    async getCourseCard(courseName) {
        return this.courseCards.filter({ hasText: courseName });
    }

    async enrollInCourse(courseName) {
        const courseCard = this.getCourseCard(courseName);
        await courseCard.getByRole('button', { name: /enroll/i }).click();
    }

    // URL verification
    async isOnCorrectURL() {
        return this.page.url().includes('my_classroom');
    }

    // Assertions - Page specific
    async expectWelcomeMessageVisible() {
        await this.expectVisible(this.welcomeMessage);
    }

    async expectTabsVisible() {
        await this.expectVisible(this.coursesTab);
        await this.expectVisible(this.learningPathsTab);
        await this.expectVisible(this.skillsAssessmentTab);
    }

    async expectFeaturedCourseCardVisible() {
        await this.expectVisible(this.featuredResumeBtn);
        await this.expectVisible(this.featuredSeeDetailsBtn);
    }

    async expectFilterPillsVisible() {
        await this.expectVisible(this.allFilterPill);
        await this.expectVisible(this.inProgressFilterPill);
        await this.expectVisible(this.completedFilterPill);
    }

    // REUSE_METHOD: clickInProgressFilter
    async clickInProgressFilter() {
        await this.inProgressFilterPill.click();
    }

    async clickCompletedFilter() {
        await this.completedFilterPill.click();
    }

    async overdueBadgeCount() {
        return await this.overdueBadges.count();
    }

    // Read the count badge embedded in a filter pill label, e.g. "In progress 13" → 13.
    // The classroom course list is not exposed via a stable card selector, so the
    // pill counts are the reliable signal for the status breakdown.
    async filterPillCount(pill) {
        const label = (await pill.textContent()) || '';
        const match = label.match(/(\d+)\s*$/);
        return match ? parseInt(match[1], 10) : NaN;
    }

    async getFilterCounts() {
        // The count badges initialise to "All 0" and then update after an async
        // fetch, so wait until the "All" pill shows a non-zero total before reading.
        await this.allFilterPill.waitFor({ state: 'visible' });
        for (let i = 0; i < 30; i++) {
            if ((await this.filterPillCount(this.allFilterPill)) > 0) break;
            await this.page.waitForTimeout(300);
        }
        return {
            all: await this.filterPillCount(this.allFilterPill),
            inProgress: await this.filterPillCount(this.inProgressFilterPill),
            completed: await this.filterPillCount(this.completedFilterPill),
        };
    }

    async expectOverdueBadgeVisible() {
        await this.expectVisible(this.overdueBadge);
    }

    // Convenience methods that delegate to composed components
    async expectSidebarLinksVisible() {
        await this.navigation.expectSidebarLinksVisible();
    }

    async expectAllFooterLinksVisible() {
        await this.footer.expectAllFooterLinksVisible();
    }
}

module.exports = StudentMyClassroomPage;
