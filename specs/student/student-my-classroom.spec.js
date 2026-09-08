const { test, expect } = require('../../fixtures/fixtures');

/**
 * Student - My Classroom Page Tests
 * All validations run in a single test to avoid multiple logins
 */
test.describe('Student - My Classroom Page', () => {

    test('should validate My Classroom page elements and footer', async ({ studentMyClassroom }) => {
        // Navigate to My Classroom via top navigation
        await studentMyClassroom.navigateFromNav();

        // 1. Validate URL
        const isCorrectURL = await studentMyClassroom.isOnCorrectURL();
        expect(isCorrectURL).toBeTruthy();

        // 2. Verify welcome message
        await studentMyClassroom.expectWelcomeMessageVisible();

        // 3. Verify the 3 subtabs within My Classroom page
        await studentMyClassroom.expectTabsVisible();

        // 4. Verify featured course card has RESUME and SEE COURSE DETAILS buttons
        await studentMyClassroom.expectFeaturedCourseCardVisible();

        // 5. Verify filter pills (All / In progress / Completed) are visible
        await studentMyClassroom.expectFilterPillsVisible();

        // 6. Verify clicking "In progress" filter keeps user on the page with course cards
        await studentMyClassroom.clickInProgressFilter();
        expect(await studentMyClassroom.isOnCorrectURL()).toBeTruthy();

        // 7. Verify overdue badge is visible on overdue courses
        await studentMyClassroom.allFilterPill.click();
        await studentMyClassroom.expectOverdueBadgeVisible();

        // 8. Verify sidebar links
        await studentMyClassroom.expectSidebarLinksVisible();

        // 9. Verify footer with all links
        await studentMyClassroom.expectAllFooterLinksVisible();

        // 10. Switch to Learning Paths tab and verify URL stays on My Classroom
        await studentMyClassroom.clickLearningPathsTab();
        expect(await studentMyClassroom.isOnCorrectURL()).toBeTruthy();

        // 11. Switch to Skills Assessment tab
        await studentMyClassroom.clickSkillsAssessmentTab();
        expect(await studentMyClassroom.isOnCorrectURL()).toBeTruthy();

        // 12. Switch back to Courses tab
        await studentMyClassroom.clickCoursesTab();
        expect(await studentMyClassroom.isOnCorrectURL()).toBeTruthy();

        // 13. Click Completed filter and verify page stays on My Classroom
        await studentMyClassroom.clickCompletedFilter();
        expect(await studentMyClassroom.isOnCorrectURL()).toBeTruthy();
        await studentMyClassroom.allFilterPill.click();
    });

    test('should reflect status breakdown in filter counts and toggle the active pill', async ({ studentMyClassroom }) => {
        // STEP 1: Navigate to My Classroom
        await studentMyClassroom.navigateFromNav();

        // STEP 2: Read the count badges embedded in the three filter pills
        const { all, inProgress, completed } = await studentMyClassroom.getFilterCounts();

        // STEP 3: Assert the counts are sane and the two statuses are subsets of All
        // (In progress and Completed are disjoint subsets, so their sum cannot exceed All)
        expect(all).toBeGreaterThan(0);
        expect(inProgress).toBeLessThanOrEqual(all);
        expect(completed).toBeLessThanOrEqual(all);
        expect(inProgress + completed).toBeLessThanOrEqual(all);

        // STEP 4: Clicking "In progress" makes it the active pill and deactivates "All"
        await studentMyClassroom.clickInProgressFilter();
        await expect(studentMyClassroom.inProgressFilterPill).toHaveClass(/active/);
        await expect(studentMyClassroom.allFilterPill).not.toHaveClass(/active/);

        // STEP 5: Clicking "Completed" moves the active state to it
        await studentMyClassroom.clickCompletedFilter();
        await expect(studentMyClassroom.completedFilterPill).toHaveClass(/active/);

        // STEP 6: Reset back to "All" and confirm it is active again
        await studentMyClassroom.allFilterPill.click();
        await expect(studentMyClassroom.allFilterPill).toHaveClass(/active/);
    });
});
