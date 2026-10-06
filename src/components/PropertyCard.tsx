import Image from "next/image";

import type { Property } from "@/types";

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const headingId = `property-${property.id}-heading`;

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(property.price);

  return (
    <article
      aria-labelledby={headingId}
      className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-700 bg-slate-900"
    >
      <Image
        src={property.imageSrc}
        alt={property.imageAlt}
        width={640}
        height={480}
        className="aspect-[4/3] w-full object-cover"
        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
      />

      <div className="flex flex-1 flex-col p-6">
        <h2 id={headingId} className="text-xl font-semibold text-slate-100">
          {property.address}
        </h2>

        <p className="mt-2 text-2xl font-bold text-emerald-400">
          {formattedPrice}
        </p>

        <ul
          aria-label={`Property facts for ${property.address}`}
          className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-300"
        >
          <li>{property.bedrooms} bedrooms</li>
          <li>{property.bathrooms} bathrooms</li>
          <li>{property.squareFeet.toLocaleString()} square feet</li>
        </ul>

        <a
          href={property.listingUrl}
          className="mt-6 inline-flex w-fit rounded-md bg-emerald-400 px-4 py-2 font-semibold text-slate-950 hover:bg-emerald-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
        >
          View listing for {property.address}
        </a>
      </div>
    </article>
  );
}