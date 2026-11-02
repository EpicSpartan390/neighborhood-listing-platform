import { describe, expect, it } from "vitest";

import { validatePropertyInput } from "./property";

const validProperty = {
  address: "123 Maple Street",
  price: 425000,
  bedrooms: 3,
  bathrooms: 2.5,
  square_feet: 1800,
};

describe("validatePropertyInput", () => {
  it("accepts a valid property payload", () => {
    expect(validatePropertyInput(validProperty).valid).toBe(true);
  });

  it("accepts zero price, bedrooms, and bathrooms", () => {
    expect(
      validatePropertyInput({
        ...validProperty,
        price: 0,
        bedrooms: 0,
        bathrooms: 0,
      }).valid,
    ).toBe(true);
  });

  it.each([
    { ...validProperty, address: "123" },
    { ...validProperty, address: "     " },
    { ...validProperty, price: -1 },
    { ...validProperty, price: "425000" },
    { ...validProperty, bedrooms: 2.5 },
    { ...validProperty, bedrooms: -1 },
    { ...validProperty, bathrooms: -1 },
    { ...validProperty, square_feet: 0 },
    { ...validProperty, square_feet: 2.5 },
    { ...validProperty, status: "approved" },
    { ...validProperty, owner_id: "another-user" },
    {},
  ])("rejects an invalid or injected payload", (payload) => {
    expect(validatePropertyInput(payload).valid).toBe(false);
  });

  it("does not strip or coerce rejected fields", () => {
    const payload = { ...validProperty, price: "42", status: "approved" };
    const original = structuredClone(payload);

    validatePropertyInput(payload);

    expect(payload).toEqual(original);
  });

  it("preserves an error result after later validation", () => {
    const firstResult = validatePropertyInput({ ...validProperty, price: -1 });
    const savedResult = structuredClone(firstResult);

    validatePropertyInput(validProperty);

    expect(firstResult).toEqual(savedResult);
  });
});
