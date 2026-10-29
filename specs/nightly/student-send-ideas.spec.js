const { test, expect } = require('../../fixtures/fixtures');

test.describe('Student - Send Ideas Page', () => {

    test('should navigate to Send Ideas with correct URL', async ({ studentMyClassroom }) => {
        await studentMyClassroom.navigateFromNav();
        expect(studentMyClassroom.page.url()).toContain('my_classroom');

        const page = studentMyClassroom.page;
        const sendIdeasLink = page.getByRole('link', { name: ' Send Ideas' }).first();
        await Promise.all([
            page.waitForURL(/feedback\.stormwindstudios\.com/, { timeout: 30000 }),
            sendIdeasLink.click()
        ]);

        expect(page.url()).toContain('feedback.stormwindstudios.com');
    });

    test('should display main elements on Send Ideas page', async ({ studentMyClassroom }) => {
        await studentMyClassroom.navigateFromNav();

        const page = studentMyClassroom.page;
        const sendIdeasLink = page.getByRole('link', { name: ' Send Ideas' }).first();
        await Promise.all([
            page.waitForURL(/feedback\.stormwindstudios\.com/, { timeout: 30000 }),
            sendIdeasLink.click()
        ]);

        await expect(page.getByRole('heading', { name: /Have something to say/i })).toBeVisible();
        await expect(page.getByRole('navigation', { name: 'Sort requests' })
            .getByRole('button', { name: 'Search' })).toBeVisible();
        await expect(page.getByRole('complementary', { name: 'Feedback' })
            .getByRole('link', { name: 'Create A New Post' })).toBeVisible();
    });

});
