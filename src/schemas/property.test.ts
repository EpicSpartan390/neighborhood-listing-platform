import { describe, expect, it } from "vitest";

import { propertySchema } from "./property";

const validProperty = {
  address: "123 Maple Street",
  price: 425000,
  bedrooms: 3,
  bathrooms: 2.5,
  square_feet: 1800,
};

describe("propertySchema", () => {
  it("accepts a valid property payload", () => {
    expect(propertySchema.safeParse(validProperty).success).toBe(true);
  });

  it("rejects an address shorter than five characters", () => {
    expect(
      propertySchema.safeParse({ ...validProperty, address: "123" }).success,
    ).toBe(false);
  });

  it("rejects a negative price", () => {
    expect(
      propertySchema.safeParse({ ...validProperty, price: -1 }).success,
    ).toBe(false);
  });

  it("rejects a fractional bedroom count", () => {
    expect(
      propertySchema.safeParse({ ...validProperty, bedrooms: 2.5 }).success,
    ).toBe(false);
  });

  it("rejects a negative bathroom count", () => {
    expect(
      propertySchema.safeParse({ ...validProperty, bathrooms: -1 }).success,
    ).toBe(false);
  });

  it("rejects zero square feet", () => {
    expect(
      propertySchema.safeParse({ ...validProperty, square_feet: 0 }).success,
    ).toBe(false);
  });

  it("rejects an unknown field", () => {
    expect(
      propertySchema.safeParse({ ...validProperty, status: "approved" }).success,
    ).toBe(false);
  });

  it("rejects a missing required field", () => {
    const missingAddress = {
      price: validProperty.price,
      bedrooms: validProperty.bedrooms,
      bathrooms: validProperty.bathrooms,
      square_feet: validProperty.square_feet,
    };

    expect(propertySchema.safeParse(missingAddress).success).toBe(false);
  });
});
