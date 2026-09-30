const BasePage = require('../base.page');
const AdminNavigationPage = require('./admin-navigation.page');
// Reuse StudentFooterPage since footer is identical
const StudentFooterPage = require('../student/student-footer.page');

/**
 * AdminDashboardPage - Admin Dashboard page
 * URL: /team/{teamId}/reporting/{userId}
 */
class AdminDashboardPage extends BasePage {
    constructor(page) {
        super(page);

        // Compose shared components
        this.navigation = new AdminNavigationPage(page);
        this.footer = new StudentFooterPage(page);

        // Page title
        this.dashboardTitle = page.getByRole('heading', { name: 'Dashboard' });

        // ========== LICENSES SECTION ==========
        // Container: <div class="manager-team-report" id="manager-team-report">
        this.licensesSection = page.locator('#manager-team-report');
        this.licensesHeading = page.getByRole('heading', { name: 'Licenses' });
        this.licensesCard = page.locator('.card-licenses');

        // Labels (metadata only - not values)
        this.totalLicensesLabel = page.getByText('Total Licenses');
        this.availableLicensesLabel = page.getByText('Available Licenses', { exact: true });
        this.studentsAssignedLabel = page.getByText('Students Assigned', { exact: true });

        // Receive Licenses Report button
        // <button class="btn btn-success ... btn-admin" data-target="#manager-export-license-modal">
        this.receiveLicensesReportBtn = page.locator('button[data-target="#manager-export-license-modal"]');

        // ========== TEAM ACTIVITY SECTION ==========
        this.teamActivityHeading = page.getByRole('heading', { name: 'Team Activity' });

        // Labels (metadata only - not values)
        this.totalHoursTrainedLabel = page.getByText('Total Hours Trained');
        this.totalCoursesCompletedLabel = page.getByText('Total Courses Completed');

        // Resend Welcome Email button (actually an <a> tag)
        // <a class="btn btn-light d-flex text-right mr-1 btn-admin" href="/setup/team/.../resend-onboarding-email">
        this.resendWelcomeEmailBtn = page.locator('a[href*="resend-onboarding-email"]');

        // Receive Activity Report button
        this.receiveActivityReportBtn = page.getByRole('button', { name: /Receive Activity Report/i });

        // ========== STUDENTS INFORMATION SECTION ==========
        // <h2 class="block__title">Students Information</h2>
        this.studentInfoHeading = page.getByRole('heading', { name: 'Students Information' });

        // Search input (Student Information section)
        // <input id="search-term" placeholder="Search">
        this.studentSearchInput = page.locator('#search-term');

        // Groups dropdown
        this.groupsDropdown = page.locator('select').filter({ hasText: /group/i }).or(page.locator('[class*="group"]').locator('select'));

        // Status dropdown
        this.statusDropdown = page.locator('select').filter({ hasText: /Active|Inactive/i });

        // + Add User button in Student Info section (scoped to avoid matching sub-nav Add Users link)
        this.addUserBtn = page.locator('a.btn-add-user');

        // Student table
        this.studentTable = page.locator('table').first();
        this.studentTableHeaders = page.locator('th');

        // Pagination
        this.paginationNext = page.getByRole('link', { name: 'Next' });
        this.paginationLast = page.getByRole('link', { name: 'Last' });
    }

    /**
     * Navigate to Dashboard page
     */
    async goto() {
        await this.page.goto('/team/19126/reporting/145164');
        await this.page.waitForLoadState('domcontentloaded');
    }

    /**
     * Check if on correct URL
     * @returns {boolean}
     */
    async isOnCorrectURL() {
        const url = this.page.url();
        return url.includes('/reporting/');
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
     * Assert Dashboard title is visible
     */
    async expectDashboardTitleVisible() {
        await this.expectVisible(this.dashboardTitle);
    }

    /**
     * Assert Licenses section metadata is visible
     */
    async expectLicensesSectionVisible() {
        await this.expectVisible(this.licensesHeading);
        await this.expectVisible(this.totalLicensesLabel);
        await this.expectVisible(this.availableLicensesLabel);
        await this.expectVisible(this.studentsAssignedLabel);
        await this.expectVisible(this.receiveLicensesReportBtn);
    }

    /**
     * Assert Team Activity section metadata is visible
     */
    async expectTeamActivitySectionVisible() {
        await this.expectVisible(this.teamActivityHeading);
        await this.expectVisible(this.totalHoursTrainedLabel);
        await this.expectVisible(this.totalCoursesCompletedLabel);
        await this.expectVisible(this.resendWelcomeEmailBtn);
        await this.expectVisible(this.receiveActivityReportBtn);
    }

    /**
     * Assert Student Information section metadata is visible
     */
    async expectStudentInfoSectionVisible() {
        await this.expectVisible(this.studentInfoHeading);
        await this.expectVisible(this.studentSearchInput);
        await this.expectVisible(this.addUserBtn);
        // Student list no longer loads on page visit — it's deferred to after a search.
        // Table assertion removed; metadata (heading + controls) is sufficient.
    }

    /**
     * Assert all footer links are visible
     */
    async expectAllFooterLinksVisible() {
        await this.footer.expectAllFooterLinksVisible();
    }

    /**
     * Assert complete dashboard page
     */
    async expectDashboardPageComplete() {
        await this.expectNavigationVisible();
        await this.expectAdminSubNavVisible();
        await this.expectDashboardTitleVisible();
        await this.expectLicensesSectionVisible();
        await this.expectTeamActivitySectionVisible();
        await this.expectStudentInfoSectionVisible();
        await this.expectAllFooterLinksVisible();
    }
}

module.exports = AdminDashboardPage;
