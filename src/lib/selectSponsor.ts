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

function isValidIsoDate(value: string): boolean {
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(value) ||
    value.startsWith("0000-")
  ) {
    return false;
  }

  const parsed = new Date(
    `${value}T00:00:00.000Z`,
  );

  return (
    !Number.isNaN(parsed.getTime()) &&
    parsed.toISOString().slice(0, 10) === value
  );
}

function hasValidContext(
  context: SponsorSelectionContext,
): boolean {
  return (
    context.propertyId.trim().length > 0 &&
    context.placement.trim().length > 0 &&
    isValidIsoDate(context.onDate)
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

  if (left.sponsorId < right.sponsorId) {
    return -1;
  }

  if (left.sponsorId > right.sponsorId) {
    return 1;
  }

  return 0;
}

export function selectSponsor(
  context: SponsorSelectionContext,
  candidates: readonly SponsorCandidate[],
): SponsorCandidate | null {
  if (
    !hasValidContext(context) ||
    candidates.length === 0
  ) {
    return null;
  }

  return [...candidates].sort(compareCandidates)[0] ?? null;
}