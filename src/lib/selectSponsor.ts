export type SponsorTier =
  | "platinum"
  | "gold"
  | "silver"
  | "bronze";

export interface SponsorSelectionContext {
  propertyId: string;
  placement: string;
  onDate: string;
}

export interface SponsorCandidate {
  sponsorId: string;
  sponsorName: string;
  tier: SponsorTier;
  destinationUrl: string;
  sponsorDescription: string | null;
  imagePath: string | null;
  imageAlt: string;
  distanceMiles: number;
  dailyImpressions: number;
  priority: number;
}

const tierRank: Record<SponsorTier, number> = {
  platinum: 4,
  gold: 3,
  silver: 2,
  bronze: 1,
};

function hasValidContext(
  context: SponsorSelectionContext,
): boolean {
  return (
    context.propertyId.trim().length > 0 &&
    context.placement.trim().length > 0 &&
    /^\d{4}-\d{2}-\d{2}$/.test(context.onDate)
  );
}

function compareCandidates(
  left: SponsorCandidate,
  right: SponsorCandidate,
): number {
  const tierDifference =
    tierRank[right.tier] - tierRank[left.tier];

  if (tierDifference !== 0) {
    return tierDifference;
  }

  const distanceDifference =
    left.distanceMiles - right.distanceMiles;

  if (distanceDifference !== 0) {
    return distanceDifference;
  }

  const impressionDifference =
    left.dailyImpressions - right.dailyImpressions;

  if (impressionDifference !== 0) {
    return impressionDifference;
  }

  const priorityDifference =
    right.priority - left.priority;

  if (priorityDifference !== 0) {
    return priorityDifference;
  }

  return left.sponsorId.localeCompare(right.sponsorId);
}

export function selectSponsor(
  context: SponsorSelectionContext,
  candidates: readonly SponsorCandidate[],
): SponsorCandidate | null {
  if (!hasValidContext(context) || candidates.length === 0) {
    return null;
  }

  return [...candidates].sort(compareCandidates)[0] ?? null;
}