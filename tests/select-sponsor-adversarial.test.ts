import { describe, expect, it } from "vitest";

import {
  selectSponsor,
  type SponsorCandidate,
  type SponsorSelectionContext,
} from "../src/lib/selectSponsor";

const baseContext: SponsorSelectionContext = {
  propertyId: "property-adversarial",
  placement: "PROPERTY_DETAIL",
  onDate: "2026-11-16",
};

function tiedCandidate(
  sponsorId: string,
): SponsorCandidate {
  return {
    sponsorId,
    sponsorName: sponsorId,
    tier: "gold",
    destinationUrl:
      `https://example.com/${sponsorId}`,
    sponsorDescription: null,
    imagePath: null,
    imageAlt: `Illustration for ${sponsorId}`,
    distanceMiles: 1,
    dailyImpressions: 10,
    priority: 5,
  };
}

describe("selectSponsor adversarial cases", () => {
  it.each([
    "2026-02-29",
    "2026-04-31",
    "2026-99-99",
    "0000-00-00",
  ])("rejects impossible calendar date %s", (onDate) => {
    expect(
      selectSponsor(
        {
          ...baseContext,
          onDate,
        },
        [tiedCandidate("sponsor-a")],
      ),
    ).toBeNull();
  });

  it("accepts a real leap-day date", () => {
    expect(
      selectSponsor(
        {
          ...baseContext,
          onDate: "2028-02-29",
        },
        [tiedCandidate("sponsor-a")],
      )?.sponsorId,
    ).toBe("sponsor-a");
  });

  it("selects the same ID for every tied input order", () => {
    const sponsorA = tiedCandidate("sponsor-a");
    const sponsorB = tiedCandidate("sponsor-b");
    const sponsorC = tiedCandidate("sponsor-c");

    const permutations = [
      [sponsorA, sponsorB, sponsorC],
      [sponsorA, sponsorC, sponsorB],
      [sponsorB, sponsorA, sponsorC],
      [sponsorB, sponsorC, sponsorA],
      [sponsorC, sponsorA, sponsorB],
      [sponsorC, sponsorB, sponsorA],
    ];

    const winners = permutations.map(
      (candidates) =>
        selectSponsor(baseContext, candidates)
          ?.sponsorId,
    );

    expect(new Set(winners)).toEqual(
      new Set(["sponsor-a"]),
    );
  });
});