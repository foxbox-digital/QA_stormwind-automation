const { test, expect } = require('../../fixtures/fixtures');

/**
 * Admin - Add Users Page Tests
 * Tests the Add Users page metadata (labels, inputs, buttons)
 * URL: /setup/team/{userId}/invitations?group={groupId}
 * Note: Does NOT validate numeric values (license counts) as they vary
 */
test.describe('Admin - Add Users Page', () => {

    test('should validate complete add users page metadata', async ({ adminAddUsers }) => {
        // 1. Navigate to Add Users page
        await adminAddUsers.goto();

        // 2. Validate we're on the correct URL
        const isCorrectURL = await adminAddUsers.isOnCorrectURL();
        expect(isCorrectURL).toBeTruthy();

        // 3. Validate navigation is visible
        await adminAddUsers.expectNavigationVisible();

        // 4. Validate admin sub-navigation is visible
        await adminAddUsers.expectAdminSubNavVisible();

        // 5. Validate page title is visible
        await adminAddUsers.expectPageTitleVisible();

        // 6. Validate description section
        // - Group description text
        // - Licenses available text
        // - License copies label
        await adminAddUsers.expectDescriptionVisible();

        // 7. Validate user form inputs
        // - First Name input
        // - Last Name input
        // - Email input
        // - Add row link
        await adminAddUsers.expectUserFormVisible();

        // 8. Validate action buttons
        // - CANCEL button
        // - SAVE button
        await adminAddUsers.expectActionButtonsVisible();

    });

});
