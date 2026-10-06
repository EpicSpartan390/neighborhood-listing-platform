"use client";

import { useState } from "react";

import PropertyCard from "@/components/PropertyCard";
import SearchFilters, {
  type SearchFilterValues,
} from "@/components/SearchFilters";
import SponsorBanner from "@/components/SponsorBanner";
import { properties } from "@/data/properties";
import { sponsors } from "@/data/sponsors";

export default function Home() {
  const [filters, setFilters] = useState<SearchFilterValues | null>(null);

  const filteredProperties = filters
    ? properties.filter((property) => {
        const neighborhoodName = filters.neighborhood.replaceAll("-", " ");
        const maximumPrice = Number(filters.maxPrice);
        const minimumBedrooms = Number(filters.bedrooms);
        const minimumBathrooms = Number(filters.bathrooms);

        const matchesNeighborhood =
          filters.neighborhood === "pacific-palisades" ||
          property.address.toLowerCase().includes(neighborhoodName);

        const matchesPrice =
          maximumPrice === 0 || property.price <= maximumPrice;

        const matchesBedrooms =
          minimumBedrooms === 0 || property.bedrooms >= minimumBedrooms;

        const matchesBathrooms =
          minimumBathrooms === 0 || property.bathrooms >= minimumBathrooms;

        return (
          matchesNeighborhood &&
          matchesPrice &&
          matchesBedrooms &&
          matchesBathrooms
        );
      })
    : properties;

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-emerald-400">
            Neighborhood Listing Platform
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
            Find helpful resources in your neighborhood.
          </h1>

          <p className="mt-6 text-lg leading-8 text-slate-300">
            Search accessible property listings and learn about neighborhood
            sponsors through reusable, responsive interface components.
          </p>
        </header>

        <div className="mt-12">
          <SearchFilters onSearch={setFilters} />
        </div>

        <section aria-labelledby="listings-heading" className="mt-14">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 id="listings-heading" className="text-3xl font-bold">
                Featured listings
              </h2>
              <p className="mt-2 text-slate-300">
                Property information was gathered from the
                instructor-provided listing sources.
              </p>
            </div>

            <p aria-live="polite" className="font-medium text-emerald-300">
              {filteredProperties.length}{" "}
              {filteredProperties.length === 1 ? "property" : "properties"} shown
            </p>
          </div>

          {filteredProperties.length > 0 ? (
            <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <p
              role="status"
              className="mt-6 rounded-xl border border-slate-700 bg-slate-900 p-6 text-slate-200"
            >
              No properties match the selected filters. Try changing one or
              more options.
            </p>
          )}
        </section>

        <section aria-labelledby="sponsors-heading" className="mt-16">
          <h2 id="sponsors-heading" className="text-3xl font-bold">
            Neighborhood sponsors
          </h2>

          <p className="mt-2 max-w-3xl text-slate-300">
            These fictional demo sponsors show how promotional content can be
            clearly identified and presented accessibly.
          </p>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            {sponsors.map((sponsor) => (
              <SponsorBanner key={sponsor.id} sponsor={sponsor} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}