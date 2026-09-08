const { test, expect } = require('../../fixtures/fixtures');

test.describe('Student - Navigation Tests', () => {
    test('should display main navigation tabs', async ({ studentNavigation }) => {
        await studentNavigation.expectMainNavVisible();
    });

    test('should navigate to My Classroom', async ({ studentNavigation, studentPage }) => {
        await studentNavigation.navigateToMyClassroom();
        expect(studentPage.url()).toContain('my_classroom');
    });

    test('should navigate to Courses', async ({ studentNavigation, studentPage }) => {
        await studentNavigation.navigateToCourses();
        expect(studentPage.url()).toContain('topics');
    });

    test('should navigate to Learning Paths', async ({ studentNavigation, studentPage }) => {
        await studentNavigation.navigateToLearningPaths();
        expect(studentPage.url()).toContain('learningpaths');
    });

    test('should navigate to Skills Assessments', async ({ studentNavigation, studentPage }) => {
        await studentNavigation.navigateToSkillsAssessments();
        expect(studentPage.url()).toContain('assessment');
    });

    test('should navigate to Leaderboard', async ({ studentNavigation, studentPage }) => {
        await studentNavigation.navigateToLeaderboard();
        expect(studentPage.url()).toContain('leaderboard');
    });

    test('should display sidebar links', async ({ studentNavigation }) => {
        await studentNavigation.expectSidebarLinksVisible();
    });

    test('should NOT display the Admin tab (student role)', async ({ studentNavigation }) => {
        await studentNavigation.expectAdminLinkHidden();
    });

    test('should open the profile dropdown and show account menu items', async ({ studentNavigation }) => {
        await studentNavigation.openProfileMenu();
        await studentNavigation.expectProfileMenuItemsVisible();
    });
});
