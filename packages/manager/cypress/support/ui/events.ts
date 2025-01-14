/**
 * Asserts that a toast notification with the given message is visible.
 *
 * @param message - Message that should be displayed on toast notification.
 */
export const assertToast = (message: string) => {
  cy.contains('[data-qa-toast]', message).should('be.visible');
};
