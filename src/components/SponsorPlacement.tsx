import type { SponsorCandidate } from "../lib/selectSponsor";

import HouseSponsorFallback from "./HouseSponsorFallback";

interface SponsorPlacementProps {
  sponsor: SponsorCandidate | null;
  placementLabel?: string;
}

export default function SponsorPlacement({
  sponsor,
  placementLabel = "this property",
}: SponsorPlacementProps) {
  if (sponsor === null) {
    return (
      <HouseSponsorFallback
        placementLabel={placementLabel}
      />
    );
  }

  const clickHref =
    `/api/sponsor-click?sponsorId=${encodeURIComponent(
      sponsor.sponsorId,
    )}`;

  return (
    <aside
      aria-label={`Sponsored Partner: ${sponsor.sponsorName}`}
      className="rounded-2xl border border-amber-300/40 bg-amber-50 p-6 text-slate-950"
    >
      <p className="text-sm font-bold uppercase tracking-widest text-amber-800">
        Sponsored Partner
      </p>

      <h3 className="mt-2 text-2xl font-bold">
        {sponsor.sponsorName}
      </h3>

      {sponsor.sponsorDescription ? (
        <p className="mt-2 leading-7 text-slate-700">
          {sponsor.sponsorDescription}
        </p>
      ) : null}

      <a
        href={clickHref}
        aria-label={`Sponsored Partner: visit ${sponsor.sponsorName}`}
        className="mt-4 inline-flex rounded-md bg-slate-950 px-4 py-2 font-semibold text-white hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 focus-visible:ring-offset-2 focus-visible:ring-offset-amber-50"
      >
        Visit {sponsor.sponsorName}
      </a>
    </aside>
  );
}