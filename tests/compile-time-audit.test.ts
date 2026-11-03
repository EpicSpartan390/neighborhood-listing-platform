import { describe, expect, it } from "vitest";

import {
  negativePricePayload,
  safelyParseProperty,
  typeMismatchPayload,
  unsafeFormatPrice,
  unsafeParseProperty,
} from "../src/audit/compileTimeAudit";

describe("compile-time types versus runtime validation", () => {
  it("shows that an unsafe assertion allows a runtime type mismatch", () => {
    const assertedProperty =
      unsafeParseProperty(typeMismatchPayload);

    expect(typeof assertedProperty.price).toBe("string");

    expect(() =>
      unsafeFormatPrice(typeMismatchPayload),
    ).toThrow(TypeError);
  });

  it("shows that an unsafe assertion accepts a negative price", () => {
    const assertedProperty =
      unsafeParseProperty(negativePricePayload);

    expect(assertedProperty.price).toBe(-500000);
  });

  it("rejects the type mismatch at the runtime boundary", () => {
    expect(() =>
      safelyParseProperty(typeMismatchPayload),
    ).toThrow(/\/price: must be number/);
  });

  it("rejects the business-rule violation at the runtime boundary", () => {
    expect(() =>
      safelyParseProperty(negativePricePayload),
    ).toThrow(/\/price: must be >= 0/);
  });
});