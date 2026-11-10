"use client";

import Image from "next/image";
import { useState } from "react";

import type { Property } from "@/types";

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const headingId = `property-${property.id}-heading`;
  const detailsId = `property-${property.id}-details`;

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(property.price);

  function handleFavoriteClick() {
    setIsFavorite((currentFavorite) => !currentFavorite);
  }

  function handleDetailsClick() {
    setShowDetails((currentVisibility) => !currentVisibility);
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
        <header>
          <h3 id={headingId} className="text-xl font-semibold text-slate-100">
            {property.address}
          </h3>

          <p className="mt-2 text-2xl font-bold text-emerald-400">
            {formattedPrice}
          </p>
        </header>

        <ul
          aria-label={`Property facts for ${property.address}`}
          className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-300"
        >
          <li>{property.bedrooms} bedrooms</li>
          <li>{property.bathrooms} bathrooms</li>
          <li>{property.squareFeet.toLocaleString()} square feet</li>
        </ul>

        <div className="mt-auto flex flex-wrap gap-3 pt-6">
          <button
            type="button"
            onClick={handleFavoriteClick}
            aria-pressed={isFavorite}
            aria-label={
              isFavorite
                ? `Saved: remove ${property.address} from favorites`
                : `Save property: add ${property.address} to favorites`
            }
            className="inline-flex justify-center rounded-md border border-emerald-400 px-4 py-2 font-semibold text-emerald-300 hover:bg-emerald-400 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
          >
            {isFavorite ? "Saved" : "Save property"}
          </button>

          <button
            type="button"
            onClick={handleDetailsClick}
            aria-expanded={showDetails}
            aria-controls={detailsId}
            aria-label={`${showDetails ? "Hide" : "View"} details for ${property.address}`}
            className="inline-flex justify-center rounded-md bg-emerald-400 px-4 py-2 font-semibold text-slate-950 hover:bg-emerald-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
          >
            {showDetails ? "Hide Details" : "View Details"}
          </button>

          {property.listingUrl ? (
            <a
              href={property.listingUrl}
              aria-label={`View listing for ${property.address}`}
              className="inline-flex justify-center rounded-md px-4 py-2 font-semibold text-emerald-300 underline hover:text-emerald-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
            >
              View listing
            </a>
          ) : null}
        </div>

        <section
          id={detailsId}
          hidden={!showDetails}
          aria-label={`Details for ${property.address}`}
          className="mt-4 rounded-md border border-slate-700 bg-slate-950 p-4 text-sm text-slate-200"
        >
          {showDetails ? (
            <p>
              {property.address} has {property.bedrooms} bedrooms, {property.bathrooms}{" "}
              bathrooms, and {property.squareFeet.toLocaleString()} square feet.
            </p>
          ) : null}
        </section>
      </div>
    </article>
  );
}
