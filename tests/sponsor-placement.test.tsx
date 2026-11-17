import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import SponsorPlacement from "../src/components/SponsorPlacement";
import type { SponsorCandidate } from "../src/lib/selectSponsor";

const sponsor: SponsorCandidate = {
  sponsorId: "sponsor-90032",
  sponsorName: "Fictional Neighborhood Market",
  tier: "gold",
  destinationUrl:
    "https://example.com/approved-destination",
  sponsorDescription:
    "A fictional sponsor used for disclosure testing.",
  imagePath: null,
  imageAlt:
    "Illustration for the fictional neighborhood market",
  distanceMiles: 0.4,
  dailyImpressions: 12,
  priority: 5,
};

describe("SponsorPlacement", () => {
  it("renders visible and accessible sponsored disclosure", () => {
    const html = renderToStaticMarkup(
      <SponsorPlacement sponsor={sponsor} />,
    );

    expect(html).toContain("Sponsored Partner");
    expect(html).toContain(
      'aria-label="Sponsored Partner: Fictional Neighborhood Market"',
    );
    expect(html).toContain(
      'aria-label="Sponsored Partner: visit Fictional Neighborhood Market"',
    );
    expect(html).toContain(
      'href="/api/sponsor-click?sponsorId=sponsor-90032"',
    );
  });

  it("does not expose the stored destination in the DOM", () => {
    const html = renderToStaticMarkup(
      <SponsorPlacement sponsor={sponsor} />,
    );

    expect(html).not.toContain(
      sponsor.destinationUrl,
    );
  });

  it("renders the house message for a null selection", () => {
    const html = renderToStaticMarkup(
      <SponsorPlacement
        sponsor={null}
        placementLabel="the property"
      />,
    );

    expect(html).toContain("Community Message");
    expect(html).toContain(
      "not a paid or sponsored placement",
    );
    expect(html).not.toContain("Sponsored Partner");
  });
});
