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
        await loginPage.expectErrorMessage('The password you entered is incorrect');
    });

    test('should log in successfully and redirect to My Classroom', async ({ loginPage }) => {
        // STEP 1: Navigate to the login page
        await loginPage.goto();

        // STEP 2: Log in with valid student credentials
        await loginPage.login(users.student.email, users.student.password);

        // STEP 3: Assert the redirect to My Classroom
        await loginPage.expectRedirectedToClassroom();
    });

    test('should redirect away from login when already authenticated', async ({ loginPage }) => {
        // STEP 1: Navigate to the login page
        await loginPage.goto();

        // STEP 2: Log in with valid student credentials
        await loginPage.login(users.student.email, users.student.password);
        await loginPage.expectRedirectedToClassroom();

        // STEP 3: Revisit the login page while authenticated
        await loginPage.goto();

        // STEP 4: Assert we are redirected away and the email field is not shown
        await loginPage.expectRedirectedToClassroom();
        await loginPage.expectEmailFieldHidden();
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
        await loginPage.expectErrorMessage('The password you entered is incorrect');
    });

    test('should log in successfully and redirect to team reporting', async ({ loginPage }) => {
        // STEP 1: Navigate to the login page
        await loginPage.goto();

        // STEP 2: Log in with valid admin credentials
        await loginPage.login(users.admin.email, users.admin.password);

        // STEP 3: Assert the redirect to the team reporting page
        await loginPage.expectRedirectedToTeamReporting();
    });

    test('should redirect away from login when already authenticated', async ({ loginPage }) => {
        // STEP 1: Navigate to the login page
        await loginPage.goto();

        // STEP 2: Log in with valid admin credentials
        await loginPage.login(users.admin.email, users.admin.password);
        await loginPage.expectRedirectedToTeamReporting();

        // STEP 3: Revisit the login page while authenticated
        await loginPage.goto();

        // STEP 4: Assert we are redirected away and the email field is not shown
        await loginPage.expectRedirectedToTeamReporting();
        await loginPage.expectEmailFieldHidden();
    });

});
