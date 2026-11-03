import generatedDataset from "../../data/generated/synthetic-properties.json";

import type { Property, Sponsor } from "../types";
import {
  type PropertyContract,
  type PropertyContractSponsor,
  validatePropertyDataset,
} from "../validator/validateProperty";

const untrustedDataset: unknown = generatedDataset;
const validationResult = validatePropertyDataset(untrustedDataset);

if (!validationResult.valid) {
  const details = validationResult.errors
    .map((error) => {
      const location = error.instancePath || "/";
      return `${location}: ${error.message ?? "invalid value"}`;
    })
    .join("; ");

  throw new Error(`Generated property data failed validation: ${details}`);
}

function normalizeProperty(record: PropertyContract): Property {
  return {
    id: record.property_id,
    address: `${record.address.street}, ${record.address.city}, ${record.address.state} ${record.zip_code}`,
    price: record.price,
    bedrooms: record.bedrooms,
    bathrooms: record.bathrooms,
    squareFeet: record.square_feet,
    imageSrc: record.image_src,
    imageAlt: record.image_alt,
    listingUrl: record.listing_url,
  };
}

function normalizeSponsor(
  sponsor: PropertyContractSponsor,
): Sponsor {
  return {
    id: sponsor.sponsor_id,
    businessName: sponsor.business_name,
    imageSrc: sponsor.image_src,
    imageAlt: sponsor.image_alt,
    businessUrl: sponsor.target_url,
    description: sponsor.description,
  };
}

export const properties: Property[] =
  validationResult.data.records.map(normalizeProperty);

const sponsorsById = new Map<string, Sponsor>();

for (const record of validationResult.data.records) {
  for (const sponsor of record.local_sponsors) {
    if (!sponsorsById.has(sponsor.sponsor_id)) {
      sponsorsById.set(
        sponsor.sponsor_id,
        normalizeSponsor(sponsor),
      );
    }
  }
}

export const sponsors: Sponsor[] = Array.from(
  sponsorsById.values(),
);