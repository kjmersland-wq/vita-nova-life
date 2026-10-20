import { describe, expect, it } from "vitest";
import { accessForPrice, accessFromRow, PRICE_FOR_PLAN } from "./billing.server";

const now = Date.parse("2026-10-20T12:00:00Z");
const future = "2026-11-20T12:00:00Z";
const past = "2026-09-20T12:00:00Z";

describe("billing rules", () => {
  it("Annual Premium gives Premium access", () => {
    expect(PRICE_FOR_PLAN.annual).toBe("premium_yearly");
    expect(accessForPrice("premium_yearly")).toBe("premium");
  });
  it("Essential gives Essential access", () => {
    expect(accessFromRow({ price_id: "essential_monthly", status: "active", current_period_end: future }, now)).toBe("essential");
  });
  it("cancelled keeps access until the paid period ends", () => {
    expect(accessFromRow({ price_id: "premium_monthly", status: "canceled", current_period_end: future }, now)).toBe("premium");
    expect(accessFromRow({ price_id: "premium_monthly", status: "canceled", current_period_end: past }, now)).toBe("free");
  });
  it("unpaid gives no access", () => {
    expect(accessFromRow({ price_id: "premium_monthly", status: "unpaid", current_period_end: future }, now)).toBe("free");
  });
});
