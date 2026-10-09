import type { ErrorObject, ValidateFunction } from "ajv";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

import datasetSchema from "../../schemas/property-dataset.schema.json";
import propertySchema from "../../schemas/property.schema.json";
import type {
  PropertyListingContract,
  SyntheticPropertyDataset,
} from "../types/property-dataset-contract.generated";

export type PropertyContract = PropertyListingContract;

export type PropertyContractSponsor =
  PropertyListingContract["local_sponsors"][number];

export type PropertyDataset = SyntheticPropertyDataset;

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