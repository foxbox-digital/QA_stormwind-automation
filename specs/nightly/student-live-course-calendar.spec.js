const { test, expect } = require('../../fixtures/fixtures');
const StudentLiveCourseCalendarPage = require('../../pages/student/student-live-course-calendar.page');

async function openCalendar(studentMyClassroom) {
    const page = studentMyClassroom.page;
    await Promise.all([
        page.waitForURL(/\/calendar(?:\/|$)/, { waitUntil: 'domcontentloaded', timeout: 30000 }),
        studentMyClassroom.navigation.sidebarLiveCourseCalendar.click()
    ]);
    return StudentLiveCourseCalendarPage.createForPage(page);
}

test.describe('Student - Live Course Calendar', () => {
    test('should navigate to calendar from sidebar', async ({ studentMyClassroom }) => {
        const calendarPage = await openCalendar(studentMyClassroom);
        expect(calendarPage.page.url()).toContain('calendar');
    });

    test('should display Today button', async ({ studentMyClassroom }) => {
        const calendarPage = await openCalendar(studentMyClassroom);
        await calendarPage.expectTodayButtonVisible();
    });

    test('should display navigation bar', async ({ studentMyClassroom }) => {
        const calendarPage = await openCalendar(studentMyClassroom);
        await calendarPage.expectNavigationVisible();
    });

    test('should display footer', async ({ studentMyClassroom }) => {
        const calendarPage = await openCalendar(studentMyClassroom);
        await calendarPage.expectFooterVisible();
    });

    test('should display calendar grid', async ({ studentMyClassroom }) => {
        const calendarPage = await openCalendar(studentMyClassroom);
        await calendarPage.expectCalendarGridVisible();
    });

    test('should navigate to previous month when Previous button is clicked', async ({ studentMyClassroom }) => {
        const calendarPage = await openCalendar(studentMyClassroom);
        await calendarPage.clickPrevious();
        await calendarPage.expectCalendarGridVisible();
    });

    test('should navigate to next month when Next button is clicked', async ({ studentMyClassroom }) => {
        const calendarPage = await openCalendar(studentMyClassroom);
        await calendarPage.clickNext();
        await calendarPage.expectCalendarGridVisible();
    });

    test('should return to current month when Today button is clicked after navigating away', async ({ studentMyClassroom }) => {
        const calendarPage = await openCalendar(studentMyClassroom);
        await calendarPage.clickPrevious();
        await calendarPage.clickToday();
        await calendarPage.expectCalendarGridVisible();
        await calendarPage.expectTodayButtonVisible();
    });
});
