import type { ErrorObject, JSONSchemaType } from "ajv";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

export type ExamValidationResult<T> =
  | { valid: true; data: T; errors: [] }
  | { valid: false; errors: ErrorObject[] };

export function createExamValidator<T>(schema: JSONSchemaType<T>) {
  const ajv = new Ajv2020({
    strict: true,
    allErrors: true,
    coerceTypes: false,
    removeAdditional: false,
    useDefaults: false,
  });

  addFormats(ajv);
  const validate = ajv.compile<T>(schema);

  return (value: unknown): ExamValidationResult<T> => {
    if (validate(value)) {
      return { valid: true, data: value, errors: [] };
    }

    return {
      valid: false,
      errors:
        validate.errors?.map((error) => ({
          ...error,
          params: { ...error.params },
        })) ?? [],
    };
  };
}
