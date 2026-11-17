import { describe, expect, it } from "vitest";

import {
  selectSponsor,
  type SponsorCandidate,
  type SponsorSelectionContext,
  type SponsorTier,
} from "../src/lib/selectSponsor";

const context: SponsorSelectionContext = {
  propertyId: "property-90032",
  placement: "PROPERTY_DETAIL",
  onDate: "2026-11-12",
};

function candidate(
  sponsorId: string,
  sponsorName: string,
  tier: SponsorTier,
  distanceMiles: number,
  dailyImpressions: number,
  priority = 0,
): SponsorCandidate {
  return {
    sponsorId,
    sponsorName,
    tier,
    destinationUrl: `https://example.com/${sponsorId}`,
    sponsorDescription: null,
    imagePath: null,
    imageAlt: `Illustration for ${sponsorName}`,
    distanceMiles,
    dailyImpressions,
    priority,
  };
}

describe("selectSponsor", () => {
  it("selects Sponsor C for the assignment dataset", () => {
    const sponsorA = candidate(
      "sponsor-a",
      "Sponsor A",
      "silver",
      0.4,
      120,
    );

    const sponsorB = candidate(
      "sponsor-b",
      "Sponsor B",
      "gold",
      1.2,
      45,
    );

    const sponsorC = candidate(
      "sponsor-c",
      "Sponsor C",
      "gold",
      0.8,
      90,
    );

    expect(
      selectSponsor(context, [
        sponsorA,
        sponsorB,
        sponsorC,
      ])?.sponsorName,
    ).toBe("Sponsor C");
  });

  it("uses higher priority after earlier values tie", () => {
    const lowerPriority = candidate(
      "sponsor-low",
      "Lower Priority",
      "gold",
      0.5,
      10,
      2,
    );

    const higherPriority = candidate(
      "sponsor-high",
      "Higher Priority",
      "gold",
      0.5,
      10,
      8,
    );

    expect(
      selectSponsor(context, [
        lowerPriority,
        higherPriority,
      ])?.sponsorName,
    ).toBe("Higher Priority");
  });

  it("uses sponsor ID as the final stable tie-breaker", () => {
    const sponsorB = candidate(
      "sponsor-b",
      "Sponsor B",
      "gold",
      0.5,
      10,
      5,
    );

    const sponsorA = candidate(
      "sponsor-a",
      "Sponsor A",
      "gold",
      0.5,
      10,
      5,
    );

    expect(
      selectSponsor(context, [sponsorB, sponsorA])
        ?.sponsorId,
    ).toBe("sponsor-a");
  });

  it("does not mutate the candidate array", () => {
    const candidates = [
      candidate(
        "sponsor-b",
        "Sponsor B",
        "silver",
        0.2,
        1,
      ),
      candidate(
        "sponsor-a",
        "Sponsor A",
        "gold",
        0.8,
        2,
      ),
    ];

    const originalOrder = candidates.map(
      (item) => item.sponsorId,
    );

    selectSponsor(context, candidates);

    expect(
      candidates.map((item) => item.sponsorId),
    ).toEqual(originalOrder);
  });

  it("returns null when no candidate exists", () => {
    expect(selectSponsor(context, [])).toBeNull();
  });

  it("returns null for an invalid context date", () => {
    expect(
      selectSponsor(
        {
          ...context,
          onDate: "not-a-date",
        },
        [
          candidate(
            "sponsor-a",
            "Sponsor A",
            "gold",
            0.5,
            0,
          ),
        ],
      ),
    ).toBeNull();
  });
});