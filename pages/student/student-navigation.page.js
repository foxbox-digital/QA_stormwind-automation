const BasePage = require('../base.page');

/**
 * StudentNavigationPage - Shared navigation component for all student pages
 * Contains top navigation bar and sidebar elements
 */
class StudentNavigationPage extends BasePage {
    constructor(page) {
        super(page);

        // Top Navigation - Main tabs
        this.myClassroomLink = page.getByRole('link', { name: 'My Classroom' });
        this.coursesLink = page.getByRole('link', { name: 'Courses' }).first();
        this.learningPathsLink = page.getByRole('link', { name: 'Learning Paths' }).first();
        this.skillsAssessmentsLink = page.getByRole('link', { name: /skill.?assessments/i }).first();
        this.leaderboardLink = page.getByRole('link', { name: 'Leaderboard' });
        // Admin tab: manager/admin-only. Should NOT be present for the student role.
        this.adminLink = page.getByRole('link', { name: 'Admin', exact: true });

        // User profile/account
        this.profileIcon = page.locator('.profile-icon');
        this.userMenu = page.locator('.user-menu');

        // Profile dropdown menu (opened via the "Toggle Dropdown" control)
        this.profileMenuToggle = page.getByRole('button', { name: /toggle dropdown/i }).first();
        this.menuMyProfile = page.getByRole('link', { name: /^\s*My Profile\s*$/i }).first();
        this.menuSecurity = page.getByRole('link', { name: /^\s*Security\s*$/i }).first();
        this.menuActivity = page.getByRole('link', { name: /^\s*Activity\s*$/i }).first();
        this.menuMyGoals = page.getByRole('link', { name: /^\s*My Goals\s*$/i }).first();
        this.menuLogout = page.getByRole('link', { name: /^\s*Log ?out\s*$/i }).first();

        // Sidebar links (right side)
        this.sidebarWebinars = page.getByRole('link', { name: ' Webinars' }).first();
        this.sidebarNewsletter = page.getByRole('link', { name: ' Newsletter' }).first();
        this.sidebarLiveCourseCalendar = page.getByRole('link', { name: ' Live Course Calendar' }).first();
        this.sidebarMyLiveSchedule = page.getByRole('link', { name: ' My Live Schedule' }).first();
        this.sidebarContactSupport = page.getByRole('link', { name: ' Contact Support' }).first();
        this.sidebarSendIdeas = page.getByRole('link', { name: ' Send Ideas' }).first();
    }

    // Navigation methods - Main tabs
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

    // Sidebar navigation methods
    async clickWebinars() {
        await this.sidebarWebinars.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    async clickNewsletter() {
        await this.sidebarNewsletter.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    async clickLiveCourseCalendar() {
        await this.sidebarLiveCourseCalendar.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    async clickContactSupport() {
        await this.sidebarContactSupport.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    async clickSendIdeas() {
        await this.sidebarSendIdeas.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    async clickMyLiveSchedule() {
        await this.sidebarMyLiveSchedule.click();
        // Modal opens, no page navigation
    }

    // Assertions - Main navigation
    async expectMainNavVisible() {
        await this.expectVisible(this.myClassroomLink);
        await this.expectVisible(this.coursesLink);
        await this.expectVisible(this.learningPathsLink);
        await this.expectVisible(this.skillsAssessmentsLink);
        await this.expectVisible(this.leaderboardLink);
    }

    // Assertion - Admin tab must be absent for the student role
    async expectAdminLinkHidden() {
        await this.expectHidden(this.adminLink);
    }

    // Profile dropdown menu
    async openProfileMenu() {
        await this.profileMenuToggle.click();
    }

    async expectProfileMenuItemsVisible() {
        await this.expectVisible(this.menuMyProfile);
        await this.expectVisible(this.menuSecurity);
        await this.expectVisible(this.menuActivity);
        await this.expectVisible(this.menuMyGoals);
        await this.expectVisible(this.menuLogout);
    }

    // Assertions - Sidebar
    async expectSidebarLinksVisible() {
        await this.expectVisible(this.sidebarWebinars);
        await this.expectVisible(this.sidebarNewsletter);
        await this.expectVisible(this.sidebarLiveCourseCalendar);
        await this.expectVisible(this.sidebarContactSupport);
        await this.expectVisible(this.sidebarSendIdeas);
    }
}

module.exports = StudentNavigationPage;
