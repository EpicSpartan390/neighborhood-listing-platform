import { readFileSync } from "node:fs";

import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

function readJson(relativePath) {
  const fileUrl = new URL(relativePath, import.meta.url);
  return JSON.parse(readFileSync(fileUrl, "utf8"));
}

function formatError(error) {
  const location = error.instancePath || "/";
  let details = "";

  if (
    error.keyword === "enum" &&
    Array.isArray(error.params.allowedValues)
  ) {
    details = ` Allowed values: ${error.params.allowedValues.join(", ")}.`;
  }

  return `${location}: ${error.message}.${details}`;
}

const propertySchema = readJson("../schemas/property.schema.json");
const datasetSchema = readJson("../schemas/property-dataset.schema.json");
const generatedData = readJson(
  "../data/generated/synthetic-properties.json",
);

const ajv = new Ajv2020({
  allErrors: true,
  strict: true,
});

addFormats(ajv);
ajv.addSchema(propertySchema);

const validateDataset = ajv.compile(datasetSchema);
const isValid = validateDataset(generatedData);

if (isValid) {
  console.log("PASS: The AI-generated dataset satisfies the data contract.");
  process.exit(0);
}

console.error("FAIL: The AI-generated dataset violates the data contract.");

const errors = validateDataset.errors ?? [];
const records = Array.isArray(generatedData.records)
  ? generatedData.records
  : [];

for (let index = 0; index < records.length; index += 1) {
  const recordPath = `/records/${index}`;
  const recordErrors = errors.filter((error) =>
    error.instancePath.startsWith(recordPath),
  );

  if (recordErrors.length === 0) {
    console.log(
      `PASS: Record ${index + 1} (${records[index].property_id})`,
    );
    continue;
  }

  console.error(
    `FAIL: Record ${index + 1} (${records[index].property_id})`,
  );

  for (const error of recordErrors) {
    console.error(`  - ${formatError(error)}`);
  }
}

const datasetErrors = errors.filter(
  (error) => !error.instancePath.startsWith("/records/"),
);

for (const error of datasetErrors) {
  console.error(`  - ${formatError(error)}`);
}

process.exit(1);