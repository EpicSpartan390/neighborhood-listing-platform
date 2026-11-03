"use client";

import { useEffect, useState } from "react";

import PropertyCard from "@/components/PropertyCard";
import SearchFilters, {
  type SearchFilterValues,
} from "@/components/SearchFilters";
import SponsorBanner from "@/components/SponsorBanner";
import { sponsors } from "@/data/sponsors";
import { loadPropertyListings } from "@/lib/propertyListings";
import type { Property } from "@/types";

type ListingsState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "success"; properties: Property[] };

export default function Home() {
  const [filters, setFilters] = useState<SearchFilterValues | null>(null);
  const [listings, setListings] = useState<ListingsState>({ status: "loading" });
  const [loadAttempt, setLoadAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    loadPropertyListings(controller.signal)
      .then((properties) => {
        if (!controller.signal.aborted) {
          setListings({ status: "success", properties });
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) setListings({ status: "error" });
      });

    return () => controller.abort();
  }, [loadAttempt]);

  function retryListings() {
    setListings({ status: "loading" });
    setLoadAttempt((attempt) => attempt + 1);
  }

  const properties = listings.status === "success" ? listings.properties : [];

  const filteredProperties = filters
    ? properties.filter((property) => {
        const neighborhoodName = filters.neighborhood.replaceAll("-", " ");
        const maximumPrice = Number(filters.maxPrice);
        const minimumBedrooms = Number(filters.bedrooms);
        const minimumBathrooms = Number(filters.bathrooms);

        const matchesNeighborhood =
          filters.neighborhood === "all" ||
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
                Browse approved listings. Illustrations are placeholders,
                not property photographs.
              </p>
            </div>

            {listings.status === "success" ? (
              <p aria-live="polite" className="font-medium text-emerald-300">
                {filteredProperties.length}{" "}
                {filteredProperties.length === 1 ? "property" : "properties"} shown
              </p>
            ) : null}
          </div>

          {listings.status === "loading" ? (
            <p
              role="status"
              className="mt-6 rounded-xl border border-slate-700 bg-slate-900 p-6 text-slate-200"
            >
              Loading properties…
            </p>
          ) : listings.status === "error" ? (
            <div className="mt-6 rounded-xl border border-slate-700 bg-slate-900 p-6 text-slate-200">
              <p role="alert">Unable to load properties. Please try again.</p>
              <button
                type="button"
                onClick={retryListings}
                className="mt-4 rounded-md bg-emerald-400 px-5 py-3 font-semibold text-slate-950 hover:bg-emerald-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
              >
                Try again
              </button>
            </div>
          ) : properties.length === 0 ? (
            <p
              role="status"
              className="mt-6 rounded-xl border border-slate-700 bg-slate-900 p-6 text-slate-200"
            >
              No approved properties are available yet. Please check back later.
            </p>
          ) : filteredProperties.length > 0 ? (
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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
