"use client";

import Image from "next/image";
import { useState } from "react";

import type { Property } from "@/types";

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const headingId = `property-${property.id}-heading`;

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(property.price);

  function handleFavoriteClick() {
    setIsFavorite((currentFavorite) => !currentFavorite);
  }

  return (
    <article
      aria-labelledby={headingId}
      className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-700 bg-slate-900"
    >
      <Image
        src={property.imageSrc}
        alt={`${property.address}: ${property.imageAlt}`}
        width={640}
        height={480}
        className="aspect-[4/3] w-full object-cover"
        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
      />

      <div className="flex flex-1 flex-col p-6">
        <h3 id={headingId} className="text-xl font-semibold text-slate-100">
          {property.address}
        </h3>

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

        <div className="mt-auto flex flex-col gap-3 pt-6 sm:flex-row">
          <button
            type="button"
            onClick={handleFavoriteClick}
            aria-pressed={isFavorite}
            aria-label={
              isFavorite
                ? `Remove ${property.address} from favorites`
                : `Add ${property.address} to favorites`
            }
            className="inline-flex justify-center rounded-md border border-emerald-400 px-4 py-2 font-semibold text-emerald-300 hover:bg-emerald-400 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
          >
            {isFavorite ? "Saved" : "Save property"}
          </button>

          <a
            href={property.listingUrl}
            aria-label={`View listing for ${property.address}`}
            className="inline-flex justify-center rounded-md bg-emerald-400 px-4 py-2 font-semibold text-slate-950 hover:bg-emerald-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
          >
            View listing
          </a>
        </div>
      </div>
    </article>
  );
}