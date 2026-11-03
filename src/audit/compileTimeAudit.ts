import type { PropertyListingContract } from "../types/property-dataset-contract.generated";
import { validateProperty } from "../validator/validateProperty";

const baseExternalProperty = {
  property_id: "10000000-0000-4000-8000-000000000001",
  address: {
    street: "101 Fictional Vista Lane",
    city: "Pasadena",
    state: "CA",
  },
  zip_code: "91101",
  bedrooms: 3,
  bathrooms: 2.5,
  square_feet: 1950,
  amenities: [
    "GARAGE_PARKING",
    "AIR_CONDITIONING",
  ],
  image_src: "/property-placeholder.svg",
  image_alt:
    "Fictional placeholder representing a craftsman home.",
  listing_url: "https://example.com/listings/property-1",
  local_sponsors: [
    {
      sponsor_id: "20000000-0000-4000-8000-000000000001",
      business_name:
        "Palisades Community Market - Demo Sponsor",
      tier: "standard",
      target_url:
        "https://example.com/sponsors/community-market",
      image_src: "/sponsor-market.svg",
      image_alt:
        "Illustration of a fictional community market.",
      description:
        "Fictional sponsor used only for course testing.",
    },
  ],
};

export const typeMismatchPayload = JSON.stringify({
  ...baseExternalProperty,
  price: "1150000",
});

export const negativePricePayload = JSON.stringify({
  ...baseExternalProperty,
  price: -500000,
});

export function unsafeParseProperty(
  rawJson: string,
): PropertyListingContract {
  return JSON.parse(rawJson) as PropertyListingContract;
}

export function unsafeFormatPrice(rawJson: string): string {
  const property = unsafeParseProperty(rawJson);

  return property.price.toFixed(2);
}

export function safelyParseProperty(
  rawJson: string,
): PropertyListingContract {
  const parsedValue: unknown = JSON.parse(rawJson);
  const result = validateProperty(parsedValue);

  if (!result.valid) {
    const details = result.errors
      .map((error) => {
        const location = error.instancePath || "/";
        return `${location}: ${error.message ?? "invalid value"}`;
      })
      .join("; ");

    throw new Error(`Property validation failed: ${details}`);
  }

  return result.data;
}