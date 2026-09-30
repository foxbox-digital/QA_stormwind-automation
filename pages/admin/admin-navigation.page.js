const BasePage = require('../base.page');

/**
 * AdminNavigationPage - Shared navigation component for all admin pages
 * Contains main navigation bar and admin sub-navigation
 */
class AdminNavigationPage extends BasePage {
    constructor(page) {
        super(page);

        // Main Navigation Bar - Same as student plus Admin link
        this.logo = page.locator('.navbar-brand, .logo').first();
        this.myClassroomLink = page.getByRole('link', { name: 'My Classroom' });
        this.coursesLink = page.getByRole('link', { name: 'Courses' }).first();
        this.learningPathsLink = page.getByRole('link', { name: 'Learning Paths' }).first();
        this.skillsAssessmentsLink = page.getByRole('link', { name: /skills?\s*assessments/i }).first();
        this.leaderboardLink = page.getByRole('link', { name: 'Leaderboard' });
        this.adminLink = page.locator('li.main-menu-admin-link a.nav-link');

        // Search and user elements
        this.searchInput = page.getByPlaceholder('Search for a course');
        this.searchButton = page.locator('button[type="submit"]').or(page.locator('.search-button'));
        this.notificationsBell = page.locator('.notifications, [class*="notification"], .fa-bell').first();
        this.profileIcon = page.locator('.profile-icon, .user-avatar, [class*="profile"]').first();

        // Admin Sub-navigation (secondary nav bar)
        // Container: <div id="admin-shortcuts">
        this.adminSubNav = page.locator('#admin-shortcuts');

        // Dashboard: <a href="/team/19126/reporting/..."><span>Dashboard</span><i class="far fa-chart-pie-alt"></i></a>
        this.dashboardTab = this.adminSubNav.locator('a').filter({ hasText: 'Dashboard' });

        // Skills Assessments Data: <a href="/team/19126/skills-assessment/..."><span>Skills Assessments Data</span></a>
        this.skillsAssessmentsDataTab = this.adminSubNav.locator('a').filter({ hasText: 'Skills Assessments Data' });

        // Due Dates: <a href="/team/19126/due-date/..."><span>Due Dates</span></a>
        this.dueDatesTab = this.adminSubNav.locator('a').filter({ hasText: 'Due Dates' });

        // Add Users: <a href="/setup/team/.../invitations..."><span>Add Users</span></a>
        this.addUsersTab = this.adminSubNav.locator('a').filter({ hasText: 'Add Users' });

        // Manage Learning Paths: <a href="/team/learning-path"><span>Manage Learning Paths</span></a>
        this.manageLearningPathsTab = this.adminSubNav.locator('a').filter({ hasText: 'Manage Learning Paths' });
    }

    // Main navigation methods
    async navigateToMyClassroom() {
        await this.myClassroomLink.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    async navigateToCourses() {
        await this.coursesLink.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    async navigateToLearningPaths() {
        await this.learningPathsLink.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    async navigateToSkillsAssessments() {
        await this.skillsAssessmentsLink.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    async navigateToLeaderboard() {
        await this.leaderboardLink.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    async navigateToAdmin() {
        await this.adminLink.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    // Admin sub-navigation methods
    async navigateToDashboard() {
        await this.dashboardTab.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    async navigateToSkillsAssessmentsData() {
        await this.skillsAssessmentsDataTab.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    async navigateToDueDates() {
        await this.dueDatesTab.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    async navigateToAddUsers() {
        await this.addUsersTab.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    async navigateToManageLearningPaths() {
        await this.manageLearningPathsTab.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    // Search functionality
    async searchForCourse(courseName) {
        await this.searchInput.fill(courseName);
        await this.searchButton.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    // Assertions - Main navigation
    async expectMainNavVisible() {
        await this.expectVisible(this.myClassroomLink);
        await this.expectVisible(this.coursesLink);
        await this.expectVisible(this.learningPathsLink);
        await this.expectVisible(this.skillsAssessmentsLink);
        await this.expectVisible(this.leaderboardLink);
        // adminLink (li.main-menu-admin-link) is only present on the dashboard URL;
        // it is absent on other admin sub-pages. Admin link navigation is covered
        // by admin-navigation.spec.js step 14 which always starts from the dashboard.
    }

    // Assertions - Admin sub-navigation
    async expectAdminSubNavVisible() {
        await this.expectVisible(this.dashboardTab);
        await this.expectVisible(this.skillsAssessmentsDataTab);
        await this.expectVisible(this.dueDatesTab);
        await this.expectVisible(this.addUsersTab);
        await this.expectVisible(this.manageLearningPathsTab);
    }

    // Assert all navigation elements
    async expectAllNavigationVisible() {
        await this.expectMainNavVisible();
        await this.expectAdminSubNavVisible();
    }
}

module.exports = AdminNavigationPage;
