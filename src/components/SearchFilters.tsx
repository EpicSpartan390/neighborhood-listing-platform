"use client";

import { type FormEvent, useState } from "react";

export interface SearchFilterValues {
  neighborhood: string;
  maxPrice: string;
  bedrooms: string;
  bathrooms: string;
}

interface SearchFiltersProps {
  onSearch?: (filters: SearchFilterValues) => void;
}

export default function SearchFilters({ onSearch }: SearchFiltersProps) {
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const filters: SearchFilterValues = {
      neighborhood: String(formData.get("neighborhood") ?? ""),
      maxPrice: String(formData.get("maxPrice") ?? ""),
      bedrooms: String(formData.get("bedrooms") ?? ""),
      bathrooms: String(formData.get("bathrooms") ?? ""),
    };

    if (!filters.neighborhood) {
      setError("Choose a neighborhood before searching.");
      setStatus("");
      return;
    }

    setError("");
    setStatus("Search filters applied.");
    onSearch?.(filters);
  }

  const selectClasses =
    "mt-2 w-full rounded-md border border-slate-600 bg-slate-950 px-3 py-2 text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900";

  return (
    <form
      aria-labelledby="search-filters-heading"
      onSubmit={handleSubmit}
      noValidate
      className="rounded-2xl border border-slate-700 bg-slate-900 p-6"
    >
      <h2
        id="search-filters-heading"
        className="text-2xl font-semibold text-slate-100"
      >
        Search properties
      </h2>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label
            htmlFor="neighborhood"
            className="font-medium text-slate-200"
          >
            Neighborhood
          </label>
          <select
            id="neighborhood"
            name="neighborhood"
            defaultValue=""
            required
            aria-invalid={Boolean(error)}
            aria-describedby={error ? "neighborhood-error" : undefined}
            className={selectClasses}
          >
            <option value="">Choose a neighborhood</option>
            <option value="pacific-palisades">Pacific Palisades</option>
            <option value="santa-monica">Santa Monica</option>
            <option value="malibu">Malibu</option>
          </select>

          {error ? (
            <p
              id="neighborhood-error"
              role="alert"
              className="mt-2 text-sm font-medium text-rose-300"
            >
              {error}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="maxPrice" className="font-medium text-slate-200">
            Maximum price
          </label>
          <select
            id="maxPrice"
            name="maxPrice"
            defaultValue=""
            className={selectClasses}
          >
            <option value="">No maximum</option>
            <option value="1500000">$1,500,000</option>
            <option value="2500000">$2,500,000</option>
            <option value="5000000">$5,000,000</option>
          </select>
        </div>

        <div>
          <label htmlFor="bedrooms" className="font-medium text-slate-200">
            Minimum bedrooms
          </label>
          <select
            id="bedrooms"
            name="bedrooms"
            defaultValue=""
            className={selectClasses}
          >
            <option value="">Any number</option>
            <option value="2">2 or more</option>
            <option value="3">3 or more</option>
            <option value="4">4 or more</option>
          </select>
        </div>

        <div>
          <label htmlFor="bathrooms" className="font-medium text-slate-200">
            Minimum bathrooms
          </label>
          <select
            id="bathrooms"
            name="bathrooms"
            defaultValue=""
            className={selectClasses}
          >
            <option value="">Any number</option>
            <option value="1">1 or more</option>
            <option value="2">2 or more</option>
            <option value="3">3 or more</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        className="mt-6 rounded-md bg-emerald-400 px-5 py-3 font-semibold text-slate-950 hover:bg-emerald-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
      >
        Search properties
      </button>

      {status ? (
        <p role="status" className="mt-4 text-sm text-emerald-300">
          {status}
        </p>
      ) : null}
    </form>
  );
}