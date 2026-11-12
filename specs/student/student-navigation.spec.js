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

    test('should display the global course search input on the Courses page', async ({ studentNavigation }) => {
        // STEP 1: Navigate to Courses (search box lives in the nav on this page)
        await studentNavigation.navigateToCourses();

        // STEP 2: Search input is visible in the navbar
        await studentNavigation.expectNavSearchVisible();
    });

    test('should return course results for a valid search term', async ({ studentNavigation, studentPage }) => {
        // STEP 1: Navigate to Courses
        await studentNavigation.navigateToCourses();

        // STEP 2: Search for a known term
        await studentNavigation.searchCourses('Python');

        // STEP 3: Navigates to the site search page with results
        expect(studentPage.url()).toContain('site-search');
        await expect(studentPage.locator('[class*="course-card"], article, .views-row').first()).toBeVisible();
    });

    test('should not crash on empty search submit', async ({ studentNavigation, studentPage }) => {
        // STEP 1: Navigate to Courses
        await studentNavigation.navigateToCourses();

        // STEP 2: Submit empty search
        await studentNavigation.searchCourses('');

        // STEP 3: Page is still functional (no crash, URL is a valid string)
        expect(studentPage.url()).toBeTruthy();
    });

    test('should deny student access to admin routes', async ({ studentNavigation, studentPage }) => {
        // The LMS returns a 404 for admin routes visited by a student (no redirect).
        for (const path of ['/admin/dashboard', '/admin/due-dates']) {
            // STEP 1: Attempt direct navigation to an admin route
            await studentPage.goto(path);
            await studentPage.waitForLoadState('domcontentloaded');

            // STEP 2: Page shows a 404 / access-denied message — no admin content
            await expect(
                studentPage.getByText(/page not found|access denied|403|404|not authorized/i).first()
            ).toBeVisible();
        }
    });
});
