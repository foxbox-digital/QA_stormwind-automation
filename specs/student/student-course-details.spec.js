const { test, expect } = require('../../fixtures/fixtures');

/**
 * Student - Course Details Page Tests
 * URL: /stormwind-developer/ai-and-chatgpt/coding-ai-copilot
 *
 * Tests course details page layout, hero banner, modules, supplements,
 * and the Add to Classroom flow
 */
test.describe('Student - Course Details Page', () => {

    test('should validate course details page and add/remove course from classroom', async ({ studentCourseDetails }) => {
        // Navigate directly to the course details page
        await studentCourseDetails.goto('/stormwind-developer/ai-and-chatgpt/coding-ai-copilot');

        // ========== RESET STATE IF NEEDED ==========
        // If course is already added, remove it first to ensure clean state
        const isStartBtnVisible = await studentCourseDetails.startBtn.isVisible();
        if (isStartBtnVisible) {
            await studentCourseDetails.clickCheckmarkButton();
            await studentCourseDetails.waitForAddToClassroomButton();
        }

        // ========== NAVIGATION ==========

        // 1. Validate navigation bar is visible
        await studentCourseDetails.expectNavigationVisible();

        // ========== HERO BANNER ==========

        // 2. Validate hero category "AI AND CHATGPT"
        await studentCourseDetails.expectHeroCategoryVisible();

        // 3. Validate hero title "Coding with AI (Copilot)"
        await studentCourseDetails.expectHeroTitleVisible();

        // 4. Validate hero level "Beginner"
        await studentCourseDetails.expectHeroLevelVisible();

        // 5. Validate hero duration "1 hour"
        await studentCourseDetails.expectHeroDurationVisible();

        // 6. Validate hero instructor "By: Shaun Pelling"
        await studentCourseDetails.expectHeroInstructorVisible();

        // 7. Validate ADD TO CLASSROOM button is visible
        await studentCourseDetails.expectAddToClassroomBtnVisible();

        // ========== OVERVIEW SECTION ==========

        // 8. Validate Overview section (heading + description)
        await studentCourseDetails.expectOverviewSectionVisible();

        // ========== MODULES SECTION ==========

        // 9. Validate Modules heading is visible
        await studentCourseDetails.expectModulesHeadingVisible();

        // 10. Validate Module 1: Getting Started with Copilot
        await studentCourseDetails.expectModule1Visible();

        // 11. Validate Module 2: Context and Project Application
        await studentCourseDetails.expectModule2Visible();

        // 12. Validate Module 3: Server Setup, Features, and Wrap-Up
        await studentCourseDetails.expectModule3Visible();

        // ========== SUPPLEMENTS SECTION ==========

        // 13. Validate Supplements section with all 4 links
        await studentCourseDetails.expectSupplementsSectionVisible();

        // ========== FOOTER ==========

        // 14. Validate footer links
        await studentCourseDetails.expectAllFooterLinksVisible();

        // ========== ADD TO CLASSROOM FLOW ==========

        // 15. Click ADD TO CLASSROOM button
        await studentCourseDetails.clickAddToClassroom();

        // 16. Wait for START button to appear
        await studentCourseDetails.waitForStartButton();

        // 17. Validate progress indicator "0% complete" is visible
        await studentCourseDetails.expectProgressVisible();

        // 18. Validate START button is visible
        await studentCourseDetails.expectStartBtnVisible();

        // 19. Validate checkmark button is visible
        await studentCourseDetails.expectCheckmarkBtnVisible();

        // ========== REMOVE FROM CLASSROOM ==========

        // 20. Click checkmark button to remove course from classroom
        await studentCourseDetails.clickCheckmarkButton();

        // 21. Wait for ADD TO CLASSROOM button to reappear
        await studentCourseDetails.waitForAddToClassroomButton();

        // 22. Validate ADD TO CLASSROOM button is visible again
        await studentCourseDetails.expectAddToClassroomBtnVisible();
    });

});
