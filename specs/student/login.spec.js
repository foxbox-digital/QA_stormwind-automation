const { test, expect, users } = require('../../fixtures/fixtures');

test.describe('Login Page', () => {

    test('should show an error when the password is incorrect', async ({ loginPage }) => {
        // STEP 1: Navigate to the login page
        await loginPage.goto();

        // STEP 2: Enter a valid email and advance to the password step
        await loginPage.enterEmail(users.student.email);

        // STEP 3: Enter an incorrect password
        await loginPage.enterPassword('definitely-wrong-pw');

        // STEP 4: Submit the login form
        await loginPage.clickLogin();

        // STEP 5: Assert we stay on the login page with the incorrect-password error
        await loginPage.expectStillOnLogin();
        await loginPage.expectErrorMessage('or password is incorrect');
    });

    test('should log in successfully and redirect to My Classroom', async ({ loginPage }) => {
        // STEP 1: Navigate to the login page
        await loginPage.goto();

        // STEP 2: Log in with valid student credentials
        await loginPage.login(users.student.email, users.student.password);

        // STEP 3: Assert the redirect to My Classroom
        await loginPage.expectRedirectedToClassroom();
    });

});

test.describe('Session and logout', () => {

    test('should log out and require login to access a protected route', async ({ studentNavigation, studentPage }) => {
        // STEP 1: Navigate to Courses to confirm session is active
        await studentNavigation.navigateToCourses();
        expect(studentPage.url()).toContain('topics');

        // STEP 2: Log out via the profile dropdown
        await studentNavigation.logout();

        // STEP 3: Navigate to a route that requires auth
        await studentPage.goto('/topics');
        await studentPage.waitForLoadState('domcontentloaded');

        // STEP 4: Should be bounced to the login page
        expect(studentPage.url()).toContain('/user/login');
    });

    test('should persist session after page reload', async ({ studentPage }) => {
        // STEP 1: Fixture already landed on /my_classroom/ — reload to verify session survives
        await studentPage.reload();
        await studentPage.waitForLoadState('domcontentloaded');

        // STEP 2: Session intact — not bounced to login
        expect(studentPage.url()).not.toContain('/user/login');
        expect(studentPage.url()).toContain('my_classroom');
    });

});

test.describe('Login Page - Admin role', () => {

    test('should show an error when the password is incorrect', async ({ loginPage }) => {
        // STEP 1: Navigate to the login page
        await loginPage.goto();

        // STEP 2: Enter a valid admin email and advance to the password step
        await loginPage.enterEmail(users.admin.email);

        // STEP 3: Enter an incorrect password
        await loginPage.enterPassword('definitely-wrong-pw');

        // STEP 4: Submit the login form
        await loginPage.clickLogin();

        // STEP 5: Assert we stay on the login page with the incorrect-password error
        await loginPage.expectStillOnLogin();
        await loginPage.expectErrorMessage('or password is incorrect');
    });

    test('should log in successfully and redirect to team reporting', async ({ loginPage }) => {
        // STEP 1: Navigate to the login page
        await loginPage.goto();

        // STEP 2: Log in with valid admin credentials
        await loginPage.login(users.admin.email, users.admin.password);

        // STEP 3: Assert the redirect to the team reporting page
        await loginPage.expectRedirectedToTeamReporting();
    });

});
