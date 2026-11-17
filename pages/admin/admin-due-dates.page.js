const BasePage = require('../base.page');
const AdminNavigationPage = require('./admin-navigation.page');
const StudentFooterPage = require('../student/student-footer.page');

/**
 * AdminDueDatesPage - Due Dates page for managers
 * URL: /team/{teamId}/due-date/{userId}
 */
class AdminDueDatesPage extends BasePage {
    constructor(page) {
        super(page);

        // Compose shared components
        this.navigation = new AdminNavigationPage(page);
        this.footer = new StudentFooterPage(page);

        // Page title
        this.pageTitle = page.getByRole('heading', { name: 'Due Dates', exact: true });

        // ========== SUMMARY SECTION ==========
        this.totalDueDatesLabel = page.getByText('Total due dates');
        // Progress gauge labels (use .first() as there are multiple gauges)
        // <span class="d-inline-block font-weight-normal font-size-sm">Completed</span>
        this.completedLabel = page.locator('.progress-gauge__percentage-complete span.font-size-sm').filter({ hasText: 'Completed' }).first();
        this.inProgressLabel = page.locator('.progress-gauge__percentage-complete span.font-size-sm').filter({ hasText: 'In Progress' }).first();
        this.overdueLabel = page.locator('.progress-gauge__percentage-complete span.font-size-sm').filter({ hasText: 'Overdue' }).first();

        // Search for a course input (in summary section)
        // <input id="manager-course-search" placeholder="Search for a course">
        this.searchCourseInput = page.locator('#manager-course-search');

        // ASSIGN A DUE DATE button
        // <button class="btn btn-primary" id="btn-create-duedate">Assign a Due Date</button>
        this.assignDueDateBtn = page.locator('#btn-create-duedate');

        // ========== ALL DUE DATES SECTION ==========
        this.allDueDatesHeading = page.getByRole('heading', { name: 'All Due Dates' });
        // <input placeholder="Search for a course or a student"> inside #manager-due-date-div
        this.searchCourseOrStudentInput = page.locator('#manager-due-date-div input.search-term');

        // Table headers
        this.courseHeader = page.getByRole('columnheader', { name: /Course/i });
        this.dueDateHeader = page.getByRole('columnheader', { name: /Due Date/i });
        this.studentsAssignedHeader = page.getByRole('columnheader', { name: /Students Assigned/i });
        this.studentsCompletedHeader = page.getByRole('columnheader', { name: /Students Completed/i });
        this.percentageCompletedHeader = page.getByRole('columnheader', { name: /Percentage Completed/i });

        // Table
        this.dueDatesTable = page.locator('table').first();
    }

    /**
     * Navigate to Due Dates page
     */
    async goto() {
        await this.page.goto('/team/19126/due-date/145164');
        await this.page.waitForLoadState('domcontentloaded');
    }

    /**
     * Check if on correct URL
     * @returns {boolean}
     */
    async isOnCorrectURL() {
        const url = this.page.url();
        return url.includes('/due-date');
    }

    /**
     * Click Assign a Due Date button
     */
    async clickAssignDueDate() {
        await this.assignDueDateBtn.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    /**
     * Search for a course in summary section
     * @param {string} searchText - Text to search for
     */
    async searchCourse(searchText) {
        await this.searchCourseInput.fill(searchText);
        await this.page.waitForTimeout(500);
    }

    /**
     * Search for a course or student in All Due Dates section
     * @param {string} searchText - Text to search for
     */
    async searchCourseOrStudent(searchText) {
        await this.searchCourseOrStudentInput.fill(searchText);
        await this.page.waitForTimeout(500);
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
     * Assert summary section metadata is visible
     */
    async expectSummarySectionVisible() {
        await this.expectVisible(this.totalDueDatesLabel);
        await this.expectVisible(this.completedLabel);
        await this.expectVisible(this.inProgressLabel);
        await this.expectVisible(this.overdueLabel);
        await this.expectVisible(this.searchCourseInput);
        await this.expectVisible(this.assignDueDateBtn);
    }

    /**
     * Assert All Due Dates section metadata is visible.
     * When the team has due dates assigned, the table renders and its column
     * headers are validated. When there are zero due dates the table is not
     * rendered at all, so we only assert that the section itself is intact.
     */
    async expectAllDueDatesSectionVisible() {
        await this.expectVisible(this.allDueDatesHeading);
        await this.expectVisible(this.searchCourseOrStudentInput);

        const hasTable = (await this.dueDatesTable.count()) > 0;
        if (hasTable) {
            await this.expectVisible(this.dueDatesTable);
            await this.expectVisible(this.courseHeader);
            await this.expectVisible(this.dueDateHeader);
            await this.expectVisible(this.studentsAssignedHeader);
            await this.expectVisible(this.studentsCompletedHeader);
            await this.expectVisible(this.percentageCompletedHeader);
        }
    }

    /**
     * Assert all footer links are visible
     */
    async expectAllFooterLinksVisible() {
        await this.footer.expectAllFooterLinksVisible();
    }

    /**
     * Assert complete Due Dates page
     */
    async expectDueDatesPageComplete() {
        await this.expectNavigationVisible();
        await this.expectAdminSubNavVisible();
        await this.expectPageTitleVisible();
        await this.expectSummarySectionVisible();
        await this.expectAllDueDatesSectionVisible();
        await this.expectAllFooterLinksVisible();
    }
}

module.exports = AdminDueDatesPage;
