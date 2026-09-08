const { test, expect } = require('../../fixtures/fixtures');

/**
 * Student - Course Lessons Page Tests
 * Tests the course player/lessons page after clicking Resume
 * Flow: Course Details -> Resume -> Lessons Page
 * URL: /replay/{courseId}/course-overview
 */
test.describe('Student - Course Lessons Page', () => {

    test('should navigate to lessons page via Resume and validate TOC with modules and lessons', async ({ studentPage, studentCourseLessons }) => {
        // 1. Navigate to Microsoft Azure for .NET Developers course details page
        await studentPage.goto('/stormwind-developer/microsoft-net-development/microsoft-azure-net-developers');
        await studentPage.waitForLoadState('domcontentloaded');

        // 2. Validate we're on the course details page
        expect(studentPage.url()).toContain('/microsoft-azure-net-developers');

        // 3. Click RESUME button
        const resumeBtn = studentPage.getByRole('link', { name: /resume/i });
        await resumeBtn.click();
        await studentPage.waitForLoadState('domcontentloaded');

        // 4. Validate navigation to lessons page
        const isOnLessonsPage = await studentCourseLessons.isOnLessonsPage('/replay/106477/course-overview');
        expect(isOnLessonsPage).toBeTruthy();

        // 5. Validate navigation bar is visible
        await studentCourseLessons.expectNavigationVisible();

        // 6. Validate page header (Course Overview heading)
        await studentCourseLessons.expectPageHeaderVisible();

        // 7. Validate course title is visible
        await studentCourseLessons.expectCourseTitleVisible();

        // ========== TABLE OF CONTENTS ==========

        // 8. Validate Table of Contents is visible
        await studentCourseLessons.expectTocVisible();

        // 9. Validate all 13 modules exist in TOC
        await studentCourseLessons.expectAllModulesInToc();

        // ========== MODULE EXPANSION & LESSONS ==========

        // 10. Click on "Get Started with Microsoft Azure" module to expand it
        await studentCourseLessons.clickModule('Get Started with Microsoft Azure');

        // 11. Validate lessons are visible after expansion
        await studentCourseLessons.expectLessonsVisible();

        // 12. Validate lessons have play icons
        await studentCourseLessons.expectLessonsHavePlayIcons();

        // ========== SUPPLEMENTS & MENTORING ==========

        // 13. Scroll TOC and validate Supplements section is visible
        await studentCourseLessons.expectSupplementsSectionVisible();

        // 14. Validate Supplements GitHub link is visible
        await studentCourseLessons.expectSupplementsGitHubLinkVisible();

        // 15. Validate REQUEST MENTORING button is visible
        await studentCourseLessons.expectRequestMentoringBtnVisible();

        // ========== FOOTER ==========

        // 16. Validate footer links
        await studentCourseLessons.expectAllFooterLinksVisible();
    });

});
