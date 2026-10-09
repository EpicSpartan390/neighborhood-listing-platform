import { readFileSync } from "node:fs";

import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

function readJson(relativePath) {
  const fileUrl = new URL(relativePath, import.meta.url);
  return JSON.parse(readFileSync(fileUrl, "utf8"));
}

const propertySchema = readJson("../schemas/property.schema.json");
const datasetSchema = readJson("../schemas/property-dataset.schema.json");

const ajv = new Ajv2020({
  allErrors: true,
  strict: true,
});

addFormats(ajv);

for (const schema of [propertySchema, datasetSchema]) {
  const isSchemaValid = ajv.validateSchema(schema);

  if (!isSchemaValid) {
    console.error(ajv.errors);
    throw new Error(`Invalid JSON Schema: ${schema.$id}`);
  }
}

ajv.addSchema(propertySchema);
ajv.compile(datasetSchema);

console.log("Property schema is valid Draft 2020-12.");
console.log("Dataset schema is valid Draft 2020-12.");
console.log("The dataset schema successfully references the property schema.");