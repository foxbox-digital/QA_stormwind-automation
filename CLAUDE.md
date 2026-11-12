# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Stormwind Playwright Project — Claude Guide

## Project overview

JavaScript Playwright test suite for the Stormwind Studios LMS (base URL: `https://test-spectre.pantheonsite.io/`).
Uses Page Object Model (POM) with a `BasePage` foundation, composed page objects, and Playwright fixtures for auth.

## Commands

```bash
# Run all tests
npm test

# Run only admin, student, or nightly specs
npm run test:admin
npm run test:student
npx playwright test specs/nightly

# Run a single spec file
npx playwright test specs/admin/admin-dashboard.spec.js

# Run a single test by title (substring match)
npx playwright test --grep "should display dashboard"

# Run with browser visible
npm run test:headed

# Open interactive UI mode
npm run test:ui

# Debug a test (step through)
npm run test:debug

# Open last HTML report
npm run report
```

Tests run sequentially (1 worker, `fullyParallel: false`). Global timeout is 60 s per test; assertion timeout is 5 s.
`BASE_URL` can be overridden via environment variable (defaults to `https://test-spectre.pantheonsite.io/`).

## Directory structure

```
specs/
  admin/     ← test specs for admin/manager flows
  nightly/   ← scheduled / nightly specs (mirrors admin + student flows for CI)
  student/   ← test specs for student flows
pages/
  base.page.js        ← BasePage (all page objects extend this)
  login.page.js
  admin/              ← AdminXxxPage classes + index.js (central re-export)
  student/            ← StudentXxxPage classes + index.js (central re-export)
fixtures/
  fixtures.js         ← extends Playwright test with pre-authenticated pages
data/
  users.js            ← test user credentials
  urls.js             ← named URL constants
```

## Fixture usage

All specs import `test` and `expect` from the fixtures file, never from `@playwright/test` directly. `users` and `URLS` are also re-exported from there, so specs can import everything they need from one place:

```js
const { test, expect, users, URLS } = require('../../fixtures/fixtures');

test('example', async ({ adminDashboard, adminNavigation }) => { ... });
```

**All available fixtures:**

| Fixture | Auth role | Notes |
|---|---|---|
| `loginPage` | none | Unauthenticated login page |
| `adminPage` | admin | Raw authenticated `page` object |
| `studentPage` | student | Raw authenticated `page` object |
| `adminDashboard` | admin | |
| `adminNavigation` | admin | |
| `adminFooter` | admin | Backed by `StudentFooterPage` (shared component) |
| `adminCourseDetails` | admin | |
| `adminAssignCourseModal` | admin | |
| `adminDueDates` | admin | |
| `adminSkillsAssessmentsData` | admin | |
| `adminAddUsers` | admin | |
| `adminManageLearningPaths` | admin | |
| `adminCreateLearningPath` | admin | |
| `adminCategoryTabs` | admin | |
| `studentNavigation` | student | |
| `studentFooter` | student | |
| `studentMyClassroom` | student | |
| `studentCourses` | student | |
| `studentCoursesList` | student | |
| `studentCourseDetails` | student | |
| `studentCourseDetailsSupplements` | student | |
| `studentCourseLessons` | student | |
| `studentLearningPaths` | student | |
| `studentSkillsAssessments` | student | |
| `studentLeaderboard` | student | |
| `studentWebinars` | student | |
| `studentNewsletter` | student | |
| `studentLiveCourseCalendar` | student | |
| `studentLiveScheduleModal` | student | |
| `studentContactSupportModal` | student | |
| `studentSendIdeas` | student | |
| `studentCategoryTabs` | student | |

Adding a new page object requires registering it in `fixtures/fixtures.js` and exporting it from `pages/admin/index.js` or `pages/student/index.js`.

## Locator strategy — priority order

1. `getByRole(role, { name })` — most preferred; ties to ARIA semantics
2. `getByTestId(id)` — second preference when `data-testid` is present
3. `getByText(text)` — for readable-text assertions or links
4. `locator('css selector')` — fallback when semantic locators are unavailable

Avoid `page.locator('xpath=...')` and `page.$()`.

## STEP / REUSE_METHOD comment conventions

Use these two comment tags when writing specs and page objects to make
the intent clear and to flag extraction candidates.

### `// STEP N: <description>` (in spec files)

Marks each numbered action in a test. Keep the number sequential and the
description a one-liner that matches the corresponding page-object method.

```js
// STEP 1: Navigate to PL-300 course
await adminCourseDetails.gotoPL300Course();

// STEP 2: Click Assign Course button
await adminCourseDetails.clickAssignCourse();
```

### `// REUSE_METHOD: <methodName>` (in page object files)

Marks a method that is called from more than one spec or from more than one
location within a spec. This signals that the method should NOT be inlined
and must stay in the page object.

```js
// REUSE_METHOD: searchStudents
async searchStudents(searchText) { ... }
```

When parsing a codegen recording, apply this tag to any action sequence that
appears more than once, or that maps to an existing page-object method.

## Page object conventions

- Every page object extends `BasePage`.
- Constructor declares **all** locators as `this.xxx` properties.
- Action methods (`goto`, `click*`, `fill*`, `select*`) are `async`.
- Assertion methods are prefixed `expect` and call `this.expectVisible / expectHidden / expectText`.
- Composed sub-pages (navigation, footer, modals) are instantiated in the constructor and exposed as `this.navigation`, `this.footer`, etc.

```js
class AdminFooPage extends BasePage {
    constructor(page) {
        super(page);
        this.navigation = new AdminNavigationPage(page);
        this.someButton = page.getByRole('button', { name: 'Do Thing' });
    }

    // REUSE_METHOD: clickDoThing
    async clickDoThing() {
        await this.someButton.click();
    }

    async expectSomethingVisible() {
        await this.expectVisible(this.someButton);
    }
}
module.exports = AdminFooPage;
```

`BasePage` provides: `navigate()`, `waitForPageLoad()`, `getCurrentUrl()`, `urlContains()`, `waitForElement()`, `waitForUrl()`, `isVisible()`, `isHidden()`, `expectVisible()`, `expectHidden()`, `expectText()`, `expectUrl()`, `takeScreenshot()`.

## Adding a new flow from a codegen recording

1. **Run codegen** (user runs this; output is a raw recording):
   ```bash
   npx playwright codegen https://test-spectre.pantheonsite.io/
   ```

2. **Parse the recording** — for every recorded action, extract the locator
   using the priority order above and map it to either:
   - An existing page-object method → mark `// REUSE_METHOD`
   - A new page-object method → add to the relevant `XxxPage` class

3. **Write the spec** — number each action as `// STEP N:` and call the
   corresponding page-object method.

4. **Register the fixture** (if new page object) in `fixtures/fixtures.js`
   following the existing pattern.

5. **Export** the new page class from the relevant `pages/admin/index.js` or
   `pages/student/index.js`.

## Authentication

Tests authenticate through Playwright fixtures:
- `adminPage` → logs in as `users.admin`
- `studentPage` → logs in as `users.student`

Always use an authenticated fixture, not a bare `page` fixture, in specs.

## Development rules

- *Conventional Commits* for every commit message. Format: `<type>(<scope>)?: <description>`, e.g. `feat(auth): add Apple Sign-In verifier`, `fix(search): clamp relevance score to [0,1]`, `chore: bump dependency`. See https://www.conventionalcommits.org/en/v1.0.0/. Allowed types: `feat`, `fix`, `chore`, `refactor`, `docs`, `test`, `perf`, `build`, `ci`, `style`. Breaking changes get `!` after the type or a `BREAKING CHANGE:` footer.
- *Branch naming:* `<type>/<description>`, e.g. `feat/add-apple-signin`, `fix/clamp-relevance-score`. Never work on the main branch. Create a new branch for every feature or bug fix.
- *Commit in logical chunks*, not one mega-commit. Each commit should be a coherent unit that builds and passes tests on its own.
- *Quality gates before every commit:* tests must pass, and the project's formatter, linter, type checker and strict compile must be clean. Fix what they report. Do not suppress errors or loosen rules to get green. Where a complexity or lint limit exists as a ratchet at today's worst offenders, lower it as code gets refactored, never raise it.
- *Keep docs and schema in sync:* when changing the API, update the API docs in the same commit. When changing the database schema, include the migration file in the same commit.
- *Open a Pull Request after implementing a plan*, targeting the repo's integration branch. Review it with `/code-review` at medium effort, run from a fresh subagent so the reviewer has no implementation context, and apply findings with `--fix` (medium effort already limits it to higher-confidence findings: reasonable fixes, not a push for perfect software). Report back which findings were fixed vs. skipped, and why. Commit fixes separately. This delegates deciding what to clean up, not whether to merge: the PR still waits on a human sign-off before that.
