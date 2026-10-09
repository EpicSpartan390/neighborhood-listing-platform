import { describe, expect, it } from "vitest";

import invalidBadZip from "../data/fixtures/invalid-bad-zip.json";
import invalidMissingId from "../data/fixtures/invalid-missing-id.json";
import invalidNegativePrice from "../data/fixtures/invalid-negative-price.json";
import invalidUnknownField from "../data/fixtures/invalid-unknown-field.json";
import validListing from "../data/fixtures/valid-listing.json";
import generatedDataset from "../data/generated/synthetic-properties.json";
import rawGeneratedDataset from "../data/generated/synthetic-properties.raw.json";
import {
  validateProperty,
  validatePropertyDataset,
} from "../src/validator/validateProperty";

describe("property data contract", () => {
  it("accepts a valid property listing", () => {
    const result = validateProperty(validListing);

    expect(result.valid).toBe(true);

    if (!result.valid) {
      throw new Error("Expected the valid fixture to pass.");
    }

    expect(result.errors).toEqual([]);
    expect(result.data.property_id).toBe(
      "10000000-0000-4000-8000-000000000001",
    );
  });

  it("rejects a listing missing property_id", () => {
    const result = validateProperty(invalidMissingId);

    expect(result.valid).toBe(false);

    if (result.valid) {
      throw new Error("Expected the missing-ID fixture to fail.");
    }

    expect(result.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          keyword: "required",
          params: expect.objectContaining({
            missingProperty: "property_id",
          }),
        }),
      ]),
    );
  });

  it("rejects a negative price", () => {
    const result = validateProperty(invalidNegativePrice);

    expect(result.valid).toBe(false);

    if (result.valid) {
      throw new Error("Expected the negative-price fixture to fail.");
    }

    expect(result.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          instancePath: "/price",
          keyword: "minimum",
        }),
      ]),
    );
  });

  it("rejects an invalid ZIP code", () => {
    const result = validateProperty(invalidBadZip);

    expect(result.valid).toBe(false);

    if (result.valid) {
      throw new Error("Expected the bad-ZIP fixture to fail.");
    }

    expect(result.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          instancePath: "/zip_code",
          keyword: "pattern",
        }),
      ]),
    );
  });

  it("rejects an unexpected property", () => {
    const result = validateProperty(invalidUnknownField);

    expect(result.valid).toBe(false);

    if (result.valid) {
      throw new Error("Expected the unknown-field fixture to fail.");
    }

    expect(result.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          keyword: "additionalProperties",
          params: expect.objectContaining({
            additionalProperty: "internal_note",
          }),
        }),
      ]),
    );
  });
});

describe("property dataset contract", () => {
  it("accepts the reviewed synthetic dataset", () => {
    const result = validatePropertyDataset(generatedDataset);

    expect(result.valid).toBe(true);

    if (!result.valid) {
      throw new Error("Expected the reviewed dataset to pass.");
    }

    expect(result.errors).toEqual([]);
    expect(result.data.records).toHaveLength(5);
    expect(result.data._metadata.synthetic).toBe(true);
  });

  it("rejects the untouched AI-generated dataset", () => {
    const result = validatePropertyDataset(rawGeneratedDataset);

    expect(result.valid).toBe(false);

    if (result.valid) {
      throw new Error("Expected the raw AI dataset to fail.");
    }

    expect(result.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          instancePath: "/records/0/amenities/0",
          keyword: "enum",
        }),
      ]),
    );
  });
});