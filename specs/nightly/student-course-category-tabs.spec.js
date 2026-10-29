const { test, expect } = require('../../fixtures/fixtures');

// Tests for the category tabs row on category detail pages (/courses/{id}).
// The tab row is horizontally scrollable via chevron buttons (Scroll left / Scroll right).
// Full tab list: All, AI, Cloud, Cybersecurity, Desktop Applications, DevOps, Development,
// IT, Project Management, Ranges, Security Awareness, Skills Assessments (12 total).

test.describe('Student - Course Category Tabs', () => {

    test('should load AI category page with heading, breadcrumb and search input', async ({ studentCategoryTabs }) => {
        // STEP 1: Navigate to AI category page
        await studentCategoryTabs.gotoAICategory();

        // STEP 2: Validate page heading contains "Artificial Intelligence"
        await studentCategoryTabs.expectPageHeading('Artificial Intelligence');

        // STEP 3: Validate breadcrumb Courses link is visible
        await studentCategoryTabs.expectBreadcrumbVisible();

        // STEP 4: Validate search input is present
        await studentCategoryTabs.expectSearchInputVisible();

        // STEP 5: Validate main navigation is visible
        await studentCategoryTabs.expectNavigationVisible();
    });

    test('should display scroll chevron button and first visible tabs', async ({ studentCategoryTabs }) => {
        // STEP 1: Navigate to AI category page
        await studentCategoryTabs.gotoAICategory();

        // STEP 2: Validate the right scroll chevron button is visible
        await studentCategoryTabs.expectScrollRightVisible();

        // STEP 3: Validate initially visible tabs are present
        await studentCategoryTabs.expectVisible(studentCategoryTabs.categoryTabAll);
        await studentCategoryTabs.expectVisible(studentCategoryTabs.categoryTabAI);
        await studentCategoryTabs.expectVisible(studentCategoryTabs.categoryTabCloud);
    });

    test('should reveal Ranges and Security Awareness tabs after scrolling right', async ({ studentCategoryTabs }) => {
        // STEP 1: Navigate to AI category page
        await studentCategoryTabs.gotoAICategory();

        // STEP 2: Click scroll right to reveal hidden tabs
        await studentCategoryTabs.clickScrollRight();

        // STEP 3: Ranges tab is now visible in the scroll container
        await studentCategoryTabs.expectVisible(studentCategoryTabs.categoryTabRanges);
        await studentCategoryTabs.expectVisible(studentCategoryTabs.categoryTabSecurityAwareness);
    });

    test('should reveal Skills Assessments tab and disable right chevron at end of scroll', async ({ studentCategoryTabs }) => {
        // STEP 1: Navigate to AI category page
        await studentCategoryTabs.gotoAICategory();

        // STEP 2: Scroll right until the end
        await studentCategoryTabs.scrollToEnd();

        // STEP 3: Skills Assessments tab is now reachable
        await studentCategoryTabs.expectVisible(studentCategoryTabs.categoryTabSkillsAssessments);

        // STEP 4: Right chevron is now inactive (no more tabs to scroll to)
        await studentCategoryTabs.expectScrollRightInactive();
    });

    test('should display all 12 category tabs in the scrollable row', async ({ studentCategoryTabs }) => {
        // STEP 1: Navigate to AI category page
        await studentCategoryTabs.gotoAICategory();

        // STEP 2: Validate all 12 category tabs exist in the DOM (includes scrolled-off tabs)
        await studentCategoryTabs.expectAllCategoryTabsVisible();
    });

    test('should navigate to Cloud category when Cloud tab is clicked', async ({ studentCategoryTabs }) => {
        // STEP 1: Navigate to AI category page
        await studentCategoryTabs.gotoAICategory();

        // STEP 2: Click Cloud category tab
        await studentCategoryTabs.clickCategoryTab(studentCategoryTabs.categoryTabCloud);

        // STEP 3: Validate URL changes away from the AI category page
        expect(studentCategoryTabs.page.url()).toContain('/courses/');
        expect(studentCategoryTabs.page.url()).not.toContain('/courses/170334');
    });

    test('should navigate to Cybersecurity category when Cybersecurity tab is clicked', async ({ studentCategoryTabs }) => {
        // STEP 1: Navigate to AI category page
        await studentCategoryTabs.gotoAICategory();

        // STEP 2: Click Cybersecurity category tab
        await studentCategoryTabs.clickCategoryTab(studentCategoryTabs.categoryTabCybersecurity);

        // STEP 3: Validate URL changes away from the AI category page
        expect(studentCategoryTabs.page.url()).toContain('/courses/');
        expect(studentCategoryTabs.page.url()).not.toContain('/courses/170334');
    });

    test('should navigate to DevOps category when DevOps tab is clicked', async ({ studentCategoryTabs }) => {
        // STEP 1: Navigate to AI category page
        await studentCategoryTabs.gotoAICategory();

        // STEP 2: Click DevOps category tab
        await studentCategoryTabs.clickCategoryTab(studentCategoryTabs.categoryTabDevOps);

        // STEP 3: Validate URL changes away from the AI category page
        expect(studentCategoryTabs.page.url()).toContain('/courses/');
        expect(studentCategoryTabs.page.url()).not.toContain('/courses/170334');
    });

    test('should display all AI subcategory chips', async ({ studentCategoryTabs }) => {
        // STEP 1: Navigate to AI category page
        await studentCategoryTabs.gotoAICategory();

        // STEP 2: Validate all AI subcategory chips are visible
        await studentCategoryTabs.expectAllAIChipsVisible();
    });

    test('should filter courses when ChatGPT chip is clicked', async ({ studentCategoryTabs }) => {
        // STEP 1: Navigate to AI category page
        await studentCategoryTabs.gotoAICategory();

        // STEP 2: Click ChatGPT subcategory chip
        await studentCategoryTabs.clickChip('ChatGPT');

        // STEP 3: Validate ChatGPT chip is now active
        await studentCategoryTabs.expectChipActive('ChatGPT');

        // STEP 4: Validate course cards are visible after filtering
        await studentCategoryTabs.expectCourseCardsVisible();
    });

    test('should filter courses when Microsoft Copilot chip is clicked', async ({ studentCategoryTabs }) => {
        // STEP 1: Navigate to AI category page
        await studentCategoryTabs.gotoAICategory();

        // STEP 2: Click Microsoft Copilot subcategory chip
        await studentCategoryTabs.clickChip('Microsoft Copilot');

        // STEP 3: Validate Microsoft Copilot chip is now active
        await studentCategoryTabs.expectChipActive('Microsoft Copilot');

        // STEP 4: Validate course cards are visible after filtering
        await studentCategoryTabs.expectCourseCardsVisible();
    });

    test('should disable left chevron at start and re-disable after scrolling back from end', async ({ studentCategoryTabs }) => {
        // STEP 1: Navigate to AI category page
        await studentCategoryTabs.gotoAICategory();

        // STEP 2: Left chevron is inactive at initial load (already at start position)
        await studentCategoryTabs.expectScrollLeftInactive();

        // STEP 3: Scroll right to the end — right chevron becomes inactive
        await studentCategoryTabs.scrollToEnd();
        await studentCategoryTabs.expectScrollRightInactive();

        // STEP 4: Scroll back left until left chevron becomes inactive again
        for (let i = 0; i < 12; i++) {
            if (await studentCategoryTabs.scrollLeftButtonActive.count() === 0) break;
            await studentCategoryTabs.clickScrollLeft();
            await studentCategoryTabs.page.waitForTimeout(300);
        }

        // STEP 5: Left chevron is inactive again — we are back at the start
        await studentCategoryTabs.expectScrollLeftInactive();
    });

});
