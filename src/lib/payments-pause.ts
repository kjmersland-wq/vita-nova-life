/** TEMPORARY: set to false to remove the notice and reopen new purchases everywhere. */
export const PAYMENTS_PAUSED = true;

export function newCheckoutAllowed(): boolean {
  return !PAYMENTS_PAUSED;
}

/** Existing customers may still cancel, update their card and view invoices, but not upgrade. */
export const PAUSED_PORTAL_FEATURES = {
  subscription_update: { enabled: false },
  subscription_cancel: { enabled: true, mode: "at_period_end" as const },
  payment_method_update: { enabled: true },
  invoice_history: { enabled: true },
};