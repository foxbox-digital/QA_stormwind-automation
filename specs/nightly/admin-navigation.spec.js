const { test, expect } = require('../../fixtures/fixtures');

/**
 * Admin - Navigation Tests
 * Validates the main navigation bar and admin sub-navigation tabs
 * for the manager/admin role.
 * All validations run in a single test to avoid multiple logins.
 */
test.describe('Admin - Navigation Tests', () => {

    test('should validate main nav, admin sub-nav tabs, and tab navigation', async ({ adminNavigation, adminPage }) => {
        test.setTimeout(300000);
        // Start on Dashboard so admin sub-nav is visible
        await adminPage.goto('/team/19126/reporting/145164');
        await adminPage.waitForLoadState('domcontentloaded');

        // STEP 1: Validate main navigation tabs are visible
        await adminNavigation.expectMainNavVisible();

        // STEP 2: Validate admin sub-navigation bar is visible
        await adminNavigation.expectAdminSubNavVisible();

        // STEP 3: Navigate to Dashboard tab and verify URL
        await adminNavigation.navigateToDashboard();
        expect(adminPage.url()).toContain('/reporting/');

        // STEP 4: Navigate to Skills Assessments Data tab and verify URL
        await adminNavigation.navigateToSkillsAssessmentsData();
        expect(adminPage.url()).toContain('/skills-assessment/');

        // STEP 5: Navigate to Due Dates tab and verify URL
        await adminNavigation.navigateToDueDates();
        expect(adminPage.url()).toContain('/due-date/');

        // STEP 6: Navigate to Add Users tab and verify URL
        await adminNavigation.navigateToAddUsers();
        expect(adminPage.url()).toContain('/invitations');

        // STEP 7: Navigate to Manage Learning Paths tab and verify URL
        await adminNavigation.navigateToManageLearningPaths();
        expect(adminPage.url()).toContain('/team/learning-path');

        // STEP 8: Return to Dashboard and validate main nav links still visible
        await adminPage.goto('/team/19126/reporting/145164');
        await adminPage.waitForLoadState('domcontentloaded');
        await adminNavigation.expectMainNavVisible();

        // STEP 9: Navigate to My Classroom via main nav and verify URL
        await adminNavigation.navigateToMyClassroom();
        expect(adminPage.url()).toContain('my_classroom');

        // STEP 10: Navigate to Courses via main nav and verify URL
        await adminPage.goto('/team/19126/reporting/145164');
        await adminPage.waitForLoadState('domcontentloaded');
        await adminNavigation.navigateToCourses();
        expect(adminPage.url()).toContain('/topics');

        // STEP 11: Navigate to Learning Paths via main nav and verify URL
        await adminPage.goto('/team/19126/reporting/145164');
        await adminPage.waitForLoadState('domcontentloaded');
        await adminNavigation.navigateToLearningPaths();
        expect(adminPage.url()).toContain('/learning-path');

        // STEP 12: Navigate to Skills Assessments via main nav and verify URL
        await adminPage.goto('/team/19126/reporting/145164');
        await adminPage.waitForLoadState('domcontentloaded');
        await adminNavigation.navigateToSkillsAssessments();
        expect(adminPage.url()).toContain('/skills-assessment');

        // STEP 13: Navigate to Leaderboard via main nav and verify URL
        await adminPage.goto('/team/19126/reporting/145164');
        await adminPage.waitForLoadState('domcontentloaded');
        await adminNavigation.navigateToLeaderboard();
        expect(adminPage.url()).toContain('leaderboard');

        // STEP 14: Navigate to Admin via main nav and verify URL contains team path
        await adminPage.goto('/team/19126/reporting/145164');
        await adminPage.waitForLoadState('domcontentloaded');
        await adminNavigation.navigateToAdmin();
        expect(adminPage.url()).toContain('/team/');
    });

});
