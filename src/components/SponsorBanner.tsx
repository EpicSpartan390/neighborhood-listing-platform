import Image from "next/image";

import type { Sponsor } from "@/types";

interface SponsorBannerProps {
  sponsor: Sponsor;
}

export default function SponsorBanner({ sponsor }: SponsorBannerProps) {
  const headingId = `sponsor-${sponsor.id}-heading`;

  return (
    <aside
      aria-labelledby={headingId}
      className="flex flex-col gap-6 rounded-2xl border border-amber-300/40 bg-amber-50 p-6 text-slate-950 sm:flex-row sm:items-center"
    >
      <Image
        src={sponsor.imageSrc}
        alt={sponsor.imageAlt}
        width={320}
        height={180}
        className="aspect-video w-full rounded-xl object-cover sm:w-48"
        sizes="(min-width: 640px) 192px, 100vw"
      />

      <div>
        <p className="text-sm font-bold uppercase tracking-widest text-amber-800">
          Sponsored
        </p>

        <h2 id={headingId} className="mt-2 text-2xl font-bold">
          {sponsor.businessName}
        </h2>

        {sponsor.description ? (
          <p className="mt-2 leading-7 text-slate-700">
            {sponsor.description}
          </p>
        ) : null}

        <a
          href={sponsor.businessUrl}
          className="mt-4 inline-flex rounded-md bg-slate-950 px-4 py-2 font-semibold text-white hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 focus-visible:ring-offset-2 focus-visible:ring-offset-amber-50"
        >
          Visit {sponsor.businessName}
        </a>
      </div>
    </aside>
  );
}