import type { ErrorObject, ValidateFunction } from "ajv";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

import datasetSchema from "../../schemas/property-dataset.schema.json";
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

export interface PropertyDatasetMetadata {
  synthetic: true;
  schema_version: "1.0.0";
  generated_by: "Google AI Studio";
  purpose: "Course lab seed fixtures only";
}

export interface PropertyDataset {
  _metadata: PropertyDatasetMetadata;
  records: PropertyContract[];
}

export type ContractValidationResult<T> =
  | {
      valid: true;
      data: T;
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
ajv.addSchema(propertySchema);

const validatePropertySchema =
  ajv.getSchema<PropertyContract>(propertySchema.$id);

if (!validatePropertySchema) {
  throw new Error("The property schema could not be compiled.");
}

const propertyValidator: ValidateFunction<PropertyContract> =
  validatePropertySchema;

const validateDatasetSchema =
  ajv.compile<PropertyDataset>(datasetSchema);

function createResult<T>(
  validator: ValidateFunction<T>,
  value: unknown,
): ContractValidationResult<T> {
  if (validator(value)) {
    return {
      valid: true,
      data: value,
      errors: [],
    };
  }

  const errors =
    validator.errors?.map((error) => ({
      ...error,
      params: { ...error.params },
    })) ?? [];

  return {
    valid: false,
    errors,
  };
}

export function validateProperty(
  value: unknown,
): ContractValidationResult<PropertyContract> {
  return createResult(propertyValidator, value);
}

export function validatePropertyDataset(
  value: unknown,
): ContractValidationResult<PropertyDataset> {
  return createResult(validateDatasetSchema, value);
}