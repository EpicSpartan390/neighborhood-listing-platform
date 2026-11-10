import type { JSONSchemaType } from "ajv";

import { createExamValidator } from "../validator/createExamValidator";

export interface PropertyInput {
  address: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  square_feet: number;
}

export const propertySchema: JSONSchemaType<PropertyInput> = {
  $id: "https://example.com/schemas/exam-property-input.schema.json",
  type: "object",
  additionalProperties: false,
  required: ["address", "price", "bedrooms", "bathrooms", "square_feet"],
  properties: {
    address: { type: "string", minLength: 5, maxLength: 500, pattern: "\\S" },
    price: { type: "number", minimum: 0, maximum: 9999999999.99 },
    bedrooms: { type: "integer", minimum: 0, maximum: 2147483647 },
    bathrooms: { type: "number", minimum: 0, maximum: 99.9 },
    square_feet: { type: "integer", minimum: 1, maximum: 2147483647 },
  },
};

export const validatePropertyInput = createExamValidator(propertySchema);
