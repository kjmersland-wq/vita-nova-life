import { describe, expect, it } from "vitest";
import { newCheckoutAllowed, PAUSED_PORTAL_FEATURES } from "./payments-pause";

describe("temporary payment pause", () => {
  it("blocks new purchases and subscriptions", () => {
    expect(newCheckoutAllowed()).toBe(false);
  });
  it("prevents paid plan changes in the existing customer portal", () => {
    expect(PAUSED_PORTAL_FEATURES.subscription_update.enabled).toBe(false);
  });
  it("keeps cancellation available through the paid period", () => {
    expect(PAUSED_PORTAL_FEATURES.subscription_cancel).toEqual({ enabled: true, mode: "at_period_end" });
  });
  it("keeps card updates and invoices available to existing users", () => {
    expect(PAUSED_PORTAL_FEATURES.payment_method_update.enabled).toBe(true);
    expect(PAUSED_PORTAL_FEATURES.invoice_history.enabled).toBe(true);
  });
});