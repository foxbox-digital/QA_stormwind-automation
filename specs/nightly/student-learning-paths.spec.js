const { test, expect } = require('../../fixtures/fixtures');

/**
 * Student - Learning Paths Page Tests
 * All validations run in a single test to avoid multiple logins
 */
test.describe('Student - Learning Paths Page', () => {

    test('should validate Learning Paths page elements, search, modal and footer', async ({ studentLearningPaths }) => {
        // Navigate to Learning Paths page
        await studentLearningPaths.goto();

        // 1. Validate URL
        const isCorrectURL = await studentLearningPaths.isOnCorrectURL();
        expect(isCorrectURL).toBeTruthy();
        expect(studentLearningPaths.page.url()).toContain('/learningpaths');

        // 2. Validate page heading
        await studentLearningPaths.expectPageHeadingVisible();

        // 3. Validate Topic dropdown/picklist
        await studentLearningPaths.expectTopicDropdownVisible();

        // 4. Validate Path Size dropdown/picklist
        await studentLearningPaths.expectPathSizeDropdownVisible();

        // 5. Validate search input is visible
        await studentLearningPaths.expectSearchInputVisible();

        // 6. Validate clicking on search input field focuses it
        await studentLearningPaths.clickSearchInput();
        await expect(studentLearningPaths.searchInput).toBeFocused();

        // 7. Validate learning path cards are displayed
        await studentLearningPaths.expectLearningPathCardsVisible();

        // 7a. Apply Path Size filter (index 1 = first non-default option) and reset
        await studentLearningPaths.selectPathSizeOption(1);
        await studentLearningPaths.page.waitForTimeout(300);
        await studentLearningPaths.resetPathSizeFilter();
        await studentLearningPaths.page.waitForTimeout(300);

        // 8. Search for "Cybersecurity Manager"
        await studentLearningPaths.searchLearningPath('Cybersecurity Manager');

        // Verify search input has the correct value
        await expect(studentLearningPaths.searchInput).toHaveValue('Cybersecurity Manager');

        // Wait for search results to filter
        await studentLearningPaths.page.waitForTimeout(1000);

        // Verify the matching learning path card is visible
        await studentLearningPaths.expectLearningPathCardVisible('Cybersecurity Manager');

        // 9. Click on learning path card to open modal
        await studentLearningPaths.openLearningPathModal('Cybersecurity Manager');

        // 10. Validate modal elements
        await studentLearningPaths.expectModalVisible();
        await studentLearningPaths.expectModalTitle('Cybersecurity Manager');
        await studentLearningPaths.expectModalCoursesCountVisible();
        await studentLearningPaths.expectModalDurationVisible();
        await studentLearningPaths.expectSeeLearningPathLinkVisible();
        await studentLearningPaths.expectModalCloseButtonVisible();

        // 11. Close the modal by clicking the X button
        await studentLearningPaths.closeModal();

        // 12. Verify modal is closed
        await studentLearningPaths.expectModalHidden();

        // 13. Validate footer with all links (Explore, Contact, About sections)
        await studentLearningPaths.expectAllFooterLinksVisible();
    });

});
