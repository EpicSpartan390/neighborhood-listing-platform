import { describe, expect, it } from "vitest";

import { properties } from "../src/data/properties";
import { sponsors } from "../src/data/sponsors";

describe("validated listing normalization", () => {
  it("normalizes all five property records for the UI", () => {
    expect(properties).toHaveLength(5);
  });

  it("converts snake_case property fields to the UI shape", () => {
    expect(properties[0]).toMatchObject({
      id: "10000000-0000-4000-8000-000000000001",
      address: "101 Fictional Vista Lane, Pasadena, CA 91101",
      price: 1150000,
      bedrooms: 3,
      bathrooms: 2.5,
      squareFeet: 1950,
      imageSrc: "/property-placeholder.svg",
      listingUrl: "https://example.com/listings/property-1",
    });
  });

  it("normalizes and removes duplicate sponsors", () => {
    expect(sponsors).toHaveLength(2);

    expect(sponsors.map((sponsor) => sponsor.id)).toEqual([
      "20000000-0000-4000-8000-000000000001",
      "20000000-0000-4000-8000-000000000002",
    ]);
  });
});