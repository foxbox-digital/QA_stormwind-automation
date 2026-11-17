const BasePage = require('../base.page');

/**
 * StudentContactSupportModalPage - "Support ticket" modal
 *
 * Opened from the sidebar "Contact Support" link. It renders a Drupal webform
 * (/form/contact-support) inside a jQuery UI dialog (role="dialog",
 * class "ui-dialog support-ticket-dialog").
 *
 * Redesigned Aug 2026: the old single free-text message field was replaced by a
 * structured ticket form with a Subject input + a Description textarea, a
 * "Submit ticket" button, and an inline "Ticket sent" / "New ticket"
 * confirmation state. Locators are role/accessible-name based to stay resilient
 * to Drupal's dynamic element ids.
 */
class StudentContactSupportModalPage extends BasePage {
    constructor(page) {
        super(page);

        // Dialog + header
        this.modal = page.getByRole('dialog', { name: /Support ticket/i });
        this.modalTitle = this.modal.getByRole('heading', { name: 'Support ticket' });
        this.modalSubtitle = this.modal.getByRole('heading', { name: /How can we help/i });
        this.modalIntro = this.modal.getByText('This opens a tracked ticket');
        this.closeButton = this.modal.getByRole('button', { name: 'Close' });

        // Form fields
        this.subjectTextbox = this.modal.getByRole('textbox', { name: 'Subject' });
        this.descriptionTextbox = this.modal.getByRole('textbox', { name: 'Description' });
        // Backward-compatible alias: the free-text message is now the Description field
        this.messageTextbox = this.descriptionTextbox;

        this.submitButton = this.modal.getByRole('button', { name: 'Submit ticket' });
        // Backward-compatible alias for the old "Request" button
        this.requestButton = this.submitButton;

        // Sidebar link to open modal
        this.contactSupportLink = page.getByRole('link', { name: ' Contact Support' }).first();

        // Confirmation state - shown after submitting a ticket
        this.ticketSentIndicator = this.modal.getByText('Ticket sent');
        this.newTicketButton = this.modal.getByRole('button', { name: 'New ticket' });
        // Backward-compatible aliases for the old success/reset assertions
        this.successMessage = this.ticketSentIndicator;
        this.resetButton = this.newTicketButton;
    }

    // REUSE_METHOD: openModal
    async openModal() {
        await this.contactSupportLink.click();
        await this.modal.waitFor({ state: 'visible', timeout: 15000 });
    }

    // REUSE_METHOD: closeModal
    async closeModal() {
        if (await this.closeButton.isVisible()) {
            await this.closeButton.click();
        }
        await this.modal.waitFor({ state: 'hidden' });
    }

    async fillSubject(text) {
        await this.subjectTextbox.fill(text);
    }

    // The free-text message is now the Description field
    async fillMessage(text) {
        await this.descriptionTextbox.fill(text);
    }

    // REUSE_METHOD: fillTicket
    async fillTicket(subject, description) {
        await this.fillSubject(subject);
        await this.fillMessage(description);
    }

    async clickSubmit() {
        await this.submitButton.click();
    }

    // Backward-compatible alias for the old "Request" button
    async clickRequest() {
        await this.clickSubmit();
    }

    async submitSupportRequest(subject, description) {
        await this.fillTicket(subject, description);
        await this.clickSubmit();
    }

    async clickNewTicket() {
        await this.newTicketButton.click();
    }

    async isModalOpen() {
        return await this.modal.isVisible();
    }

    async isModalClosed() {
        return await this.modal.isHidden();
    }

    // Assertions
    async expectModalVisible() {
        await this.modal.waitFor({ state: 'visible', timeout: 30000 });
    }

    async expectModalTitleVisible() {
        await this.expectVisible(this.modalTitle);
    }

    async expectModalSubtitleVisible() {
        await this.expectVisible(this.modalSubtitle);
    }

    async expectSubjectVisible() {
        await this.expectVisible(this.subjectTextbox);
    }

    async expectDescriptionVisible() {
        await this.expectVisible(this.descriptionTextbox);
    }

    // Backward-compatible: "textbox" now refers to the Description field
    async expectTextboxVisible() {
        await this.expectVisible(this.descriptionTextbox);
    }

    async expectSubmitButtonVisible() {
        await this.expectVisible(this.submitButton);
    }

    // Backward-compatible alias for the old "Request" button
    async expectRequestButtonVisible() {
        await this.expectVisible(this.submitButton);
    }

    async expectModalClosed() {
        await this.expectHidden(this.modal);
    }

    async expectTicketSent() {
        await this.expectVisible(this.ticketSentIndicator);
    }

    // Backward-compatible alias for the old success-message assertion
    async expectSuccessMessageVisible() {
        await this.expectTicketSent();
    }

    /**
     * Verify modal opened correctly with all elements
     */
    async verifyModalOpened() {
        await this.expectModalVisible();
        await this.expectModalTitleVisible();
        await this.expectModalSubtitleVisible();
        await this.expectSubjectVisible();
        await this.expectDescriptionVisible();
        await this.expectSubmitButtonVisible();
    }
}

module.exports = StudentContactSupportModalPage;
