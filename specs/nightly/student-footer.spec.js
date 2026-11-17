const { test, expect } = require('../../fixtures/fixtures');

/**
 * Student - Footer Tests
 * Validates all footer sections and links on the student-facing pages.
 * The footer is shared across all student pages (and admin pages).
 * All validations run in a single test to avoid multiple logins.
 */
test.describe('Student - Footer Tests', () => {

    test('should validate all footer sections and links', async ({ studentFooter, studentMyClassroom }) => {
        test.setTimeout(120000);
        // Navigate to My Classroom so the footer is present
        await studentMyClassroom.navigateFromNav();

        // STEP 1: Scroll to footer
        await studentFooter.scrollToFooter();

        // STEP 2: Validate footer container is visible
        await studentFooter.expectVisible(studentFooter.footer);

        // STEP 3: Validate EXPLORE section links
        await studentFooter.expectExploreLinksVisible();

        // STEP 4: Validate CONTACT section links
        await studentFooter.expectContactLinksVisible();

        // STEP 5: Validate ABOUT section links
        await studentFooter.expectAboutLinksVisible();

        // STEP 6: Validate all footer links together (combined assertion)
        await studentFooter.expectAllFooterLinksVisible();

        // STEP 7: Click Courses link in footer and verify navigation
        await studentFooter.clickExploreCourses();
        await expect(studentMyClassroom.page).toHaveURL(/\/topics/, { timeout: 10000 });

        // STEP 8: Go back and verify Learning Paths footer link navigates correctly
        await studentMyClassroom.navigateFromNav();
        await studentFooter.scrollToFooter();
        await studentFooter.clickExploreLearningPaths();
        await expect(studentMyClassroom.page).toHaveURL(/\/learningpaths/, { timeout: 10000 });

        // STEP 9: Go back and verify Skill Assessments footer link navigates correctly
        await studentMyClassroom.navigateFromNav();
        await studentFooter.scrollToFooter();
        await studentFooter.clickExploreSkillAssessments();
        await expect(studentMyClassroom.page).toHaveURL(/\/skillsassessment/, { timeout: 10000 });

        // STEP 10: Go back and verify Live Course Calendar footer link navigates correctly
        await studentMyClassroom.navigateFromNav();
        await studentFooter.scrollToFooter();
        await studentFooter.clickExploreLiveCourseCalendar();
        await expect(studentMyClassroom.page).toHaveURL(/calendar/, { timeout: 10000 });
    });

    test('should navigate to Webinars from footer Explore section', async ({ studentFooter, studentMyClassroom }) => {
        test.setTimeout(60000);
        await studentMyClassroom.navigateFromNav();
        await studentFooter.scrollToFooter();
        await studentFooter.clickExploreWebinars();
        expect(studentMyClassroom.page.url()).toContain('/webinar');
    });

    test('should open Terms of Use in a new tab from footer About section', async ({ studentFooter, studentMyClassroom, context }) => {
        test.setTimeout(60000);
        await studentMyClassroom.navigateFromNav();
        await studentFooter.scrollToFooter();

        const [newPage] = await Promise.all([
            context.waitForEvent('page'),
            studentFooter.aboutTermsOfUse.click()
        ]);

        await newPage.waitForLoadState('domcontentloaded');
        expect(newPage.url()).not.toContain('my_classroom');
        await newPage.close();
    });

    test('should open Privacy Policy in a new tab from footer About section', async ({ studentFooter, studentMyClassroom, context }) => {
        test.setTimeout(60000);
        await studentMyClassroom.navigateFromNav();
        await studentFooter.scrollToFooter();

        const [newPage] = await Promise.all([
            context.waitForEvent('page'),
            studentFooter.aboutPrivacyPolicy.click()
        ]);

        await newPage.waitForLoadState('domcontentloaded');
        expect(newPage.url()).not.toContain('my_classroom');
        await newPage.close();
    });

});
