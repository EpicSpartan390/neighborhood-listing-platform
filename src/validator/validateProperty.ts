import type { ErrorObject } from "ajv";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

import propertySchema from "../../schemas/property.schema.json";

export type PropertyAmenity =
  | "AIR_CONDITIONING"
  | "CENTRAL_HEATING"
  | "GARAGE_PARKING"
  | "SWIMMING_POOL"
  | "EV_CHARGING"
  | "SOLAR_PANELS";

export type SponsorTier = "standard" | "premium" | "exclusive";

export interface PropertyContractAddress {
  street: string;
  city: string;
  state: "CA";
}

export interface PropertyContractSponsor {
  sponsor_id: string;
  business_name: string;
  tier: SponsorTier;
  target_url: string;
  image_src: string;
  image_alt: string;
  description?: string;
}

export interface PropertyContract {
  property_id: string;
  address: PropertyContractAddress;
  zip_code: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  square_feet: number;
  amenities: PropertyAmenity[];
  image_src: string;
  image_alt: string;
  listing_url: string;
  local_sponsors: PropertyContractSponsor[];
}

export type PropertyValidationResult =
  | {
      valid: true;
      data: PropertyContract;
      errors: [];
    }
  | {
      valid: false;
      errors: ErrorObject[];
    };

const ajv = new Ajv2020({
  allErrors: true,
  strict: true,
});

addFormats(ajv);

const validatePropertySchema =
  ajv.compile<PropertyContract>(propertySchema);

export function validateProperty(
  value: unknown,
): PropertyValidationResult {
  if (validatePropertySchema(value)) {
    return {
      valid: true,
      data: value,
      errors: [],
    };
  }

  const errors =
    validatePropertySchema.errors?.map((error) => ({
      ...error,
      params: { ...error.params },
    })) ?? [];

  return {
    valid: false,
    errors,
  };
}