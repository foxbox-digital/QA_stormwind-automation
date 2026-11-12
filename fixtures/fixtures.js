const base = require('@playwright/test').test;
const { expect } = require('@playwright/test');
const users = require('../data/users');
const URLS = require('../data/urls');

// Page Objects - Shared
const LoginPage = require('../pages/login.page');

// Page Objects - Admin (from admin directory)
const {
    AdminNavigationPage,
    AdminDashboardPage,
    AdminCourseDetailsPage,
    AdminAssignCourseModalPage,
    AdminDueDatesPage,
    AdminSkillsAssessmentsDataPage,
    AdminAddUsersPage,
    AdminManageLearningPathsPage,
    AdminCreateLearningPathPage,
    AdminCourseCategoryTabsPage,
} = require('../pages/admin');

// Page Objects - Student (from student directory)
const {
    StudentNavigationPage,
    StudentFooterPage,
    StudentMyClassroomPage,
    StudentCoursesPage,
    StudentCoursesListPage,
    StudentCourseDetailsPage,
    StudentCourseDetailsSupplementsPage,
    StudentCourseLessonsPage,
    StudentLearningPathsPage,
    StudentSkillsAssessmentsPage,
    StudentLeaderboardPage,
    StudentWebinarsPage,
    StudentNewsletterPage,
    StudentLiveCourseCalendarPage,
    StudentLiveScheduleModalPage,
    StudentContactSupportModalPage,
    StudentSendIdeasPage,
    StudentCourseCategoryTabsPage
} = require('../pages/student');

/**
 * Custom Playwright fixtures for Stormwind application
 */
const test = base.extend({
    // Login page fixture
    loginPage: async ({ page }, use) => {
        const loginPage = new LoginPage(page);
        await use(loginPage);
    },

    // Authenticated admin page
    adminPage: async ({ page }, use) => {
        const loginPage = new LoginPage(page);
        await page.goto(URLS.LOGIN);
        await loginPage.login(users.admin.email, users.admin.password);
        // Wait for the full post-login redirect chain to settle on the reporting page.
        // waitForLoadState('domcontentloaded') fires on the interim redirect page,
        // causing ERR_ABORTED if the test navigates before the chain completes.
        await page.waitForURL(/\/team\/\d+\/reporting/, { timeout: 30000 });
        await use(page);
    },

    // Authenticated student page
    studentPage: async ({ page }, use) => {
        const loginPage = new LoginPage(page);
        await page.goto(URLS.LOGIN);
        await loginPage.login(users.student.email, users.student.password);
        // Wait for the full post-login redirect chain to settle on My Classroom.
        await page.waitForURL(/\/my_classroom\//, { timeout: 30000 });
        await use(page);
    },

    // Admin page objects - auto-initialized after login
    adminDashboard: async ({ adminPage }, use) => {
        const dashboardPage = new AdminDashboardPage(adminPage);
        await use(dashboardPage);
    },

    adminDueDates: async ({ adminPage }, use) => {
        const dueDatesPage = new AdminDueDatesPage(adminPage);
        await use(dueDatesPage);
    },

    adminSkillsAssessmentsData: async ({ adminPage }, use) => {
        const skillsAssessmentsDataPage = new AdminSkillsAssessmentsDataPage(adminPage);
        await use(skillsAssessmentsDataPage);
    },

    adminAddUsers: async ({ adminPage }, use) => {
        const addUsersPage = new AdminAddUsersPage(adminPage);
        await use(addUsersPage);
    },

    adminManageLearningPaths: async ({ adminPage }, use) => {
        const manageLearningPathsPage = new AdminManageLearningPathsPage(adminPage);
        await use(manageLearningPathsPage);
    },

    adminCreateLearningPath: async ({ adminPage }, use) => {
        const createLearningPathPage = new AdminCreateLearningPathPage(adminPage);
        await use(createLearningPathPage);
    },

    // Admin shared components
    adminNavigation: async ({ adminPage }, use) => {
        const navigationPage = new AdminNavigationPage(adminPage);
        await use(navigationPage);
    },

    // Admin footer (reuses StudentFooterPage since footer is identical)
    adminFooter: async ({ adminPage }, use) => {
        const footerPage = new StudentFooterPage(adminPage);
        await use(footerPage);
    },

    // Admin course details page (for managers)
    adminCourseDetails: async ({ adminPage }, use) => {
        const courseDetailsPage = new AdminCourseDetailsPage(adminPage);
        await use(courseDetailsPage);
    },

    // Admin assign course modal
    adminAssignCourseModal: async ({ adminPage }, use) => {
        const assignCourseModal = new AdminAssignCourseModalPage(adminPage);
        await use(assignCourseModal);
    },

    // Student shared components
    studentNavigation: async ({ studentPage }, use) => {
        const navigationPage = new StudentNavigationPage(studentPage);
        await use(navigationPage);
    },

    studentFooter: async ({ studentPage }, use) => {
        const footerPage = new StudentFooterPage(studentPage);
        await use(footerPage);
    },

    // Student page objects - auto-initialized after login
    studentMyClassroom: async ({ studentPage }, use) => {
        const myClassroomPage = new StudentMyClassroomPage(studentPage);
        await use(myClassroomPage);
    },

    studentCourses: async ({ studentPage }, use) => {
        const coursesPage = new StudentCoursesPage(studentPage);
        await use(coursesPage);
    },

    studentCoursesList: async ({ studentPage }, use) => {
        const coursesListPage = new StudentCoursesListPage(studentPage);
        await use(coursesListPage);
    },

    studentCourseDetails: async ({ studentPage }, use) => {
        const courseDetailsPage = new StudentCourseDetailsPage(studentPage);
        await use(courseDetailsPage);
    },

    studentCourseDetailsSupplements: async ({ studentPage }, use) => {
        const courseDetailsSupplementsPage = new StudentCourseDetailsSupplementsPage(studentPage);
        await use(courseDetailsSupplementsPage);
    },

    studentCourseLessons: async ({ studentPage }, use) => {
        const courseLessonsPage = new StudentCourseLessonsPage(studentPage);
        await use(courseLessonsPage);
    },

    studentLearningPaths: async ({ studentPage }, use) => {
        const learningPathsPage = new StudentLearningPathsPage(studentPage);
        await use(learningPathsPage);
    },

    studentSkillsAssessments: async ({ studentPage }, use) => {
        const skillsAssessmentsPage = new StudentSkillsAssessmentsPage(studentPage);
        await use(skillsAssessmentsPage);
    },

    studentLeaderboard: async ({ studentPage }, use) => {
        const leaderboardPage = new StudentLeaderboardPage(studentPage);
        await use(leaderboardPage);
    },

    // Sidebar pages
    studentWebinars: async ({ studentPage }, use) => {
        const webinarsPage = new StudentWebinarsPage(studentPage);
        await use(webinarsPage);
    },

    studentNewsletter: async ({ studentPage }, use) => {
        const newsletterPage = new StudentNewsletterPage(studentPage);
        await use(newsletterPage);
    },

    studentLiveCourseCalendar: async ({ studentPage }, use) => {
        const calendarPage = new StudentLiveCourseCalendarPage(studentPage);
        await use(calendarPage);
    },

    studentLiveScheduleModal: async ({ studentPage }, use) => {
        const liveScheduleModal = new StudentLiveScheduleModalPage(studentPage);
        await use(liveScheduleModal);
    },

    studentContactSupportModal: async ({ studentPage }, use) => {
        const contactSupportModal = new StudentContactSupportModalPage(studentPage);
        await use(contactSupportModal);
    },

    studentSendIdeas: async ({ studentPage }, use) => {
        const sendIdeasPage = new StudentSendIdeasPage(studentPage);
        await use(sendIdeasPage);
    },

    studentCategoryTabs: async ({ studentPage }, use) => {
        const categoryTabsPage = new StudentCourseCategoryTabsPage(studentPage);
        await use(categoryTabsPage);
    },

    adminCategoryTabs: async ({ adminPage }, use) => {
        const categoryTabsPage = new AdminCourseCategoryTabsPage(adminPage);
        await use(categoryTabsPage);
    }
});

module.exports = { test, expect, users, URLS };
