import type { JSONSchemaType } from "ajv";

import { createExamValidator } from "../validator/createExamValidator";

export type SponsorPlacement =
  | "PROPERTY_DETAIL"
  | "PROPERTY_LIST";

export type SponsorPageContext =
  | "property_detail"
  | "property_list";

export interface SponsorImpressionInput {
  sponsorId: string;
  placement: SponsorPlacement;
  pageContext: SponsorPageContext;
}

export const sponsorImpressionSchema:
  JSONSchemaType<SponsorImpressionInput> = {
    $id: "https://example.com/schemas/sponsor-impression-input.schema.json",
    type: "object",
    additionalProperties: false,
    required: [
      "sponsorId",
      "placement",
      "pageContext",
    ],
    properties: {
      sponsorId: {
        type: "string",
        format: "uuid",
      },
      placement: {
        type: "string",
        enum: [
          "PROPERTY_DETAIL",
          "PROPERTY_LIST",
        ],
      },
      pageContext: {
        type: "string",
        enum: [
          "property_detail",
          "property_list",
        ],
      },
    },
  };

export const validateSponsorImpressionInput =
  createExamValidator(sponsorImpressionSchema);