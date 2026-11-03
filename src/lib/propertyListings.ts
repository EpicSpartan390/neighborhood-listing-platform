import type { Property } from "@/types";

const loadError = "Unable to load properties. Please try again.";

interface PublicProperty {
  id: string;
  address: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  square_feet: number;
}

function isPublicProperty(value: unknown): value is PublicProperty {
  if (!value || typeof value !== "object") return false;
  const row = value as Partial<PublicProperty>;

  return (
    typeof row.id === "string" && row.id.trim().length > 0 &&
    typeof row.address === "string" && row.address.trim().length > 0 &&
    typeof row.price === "number" && Number.isFinite(row.price) && row.price >= 0 &&
    typeof row.bedrooms === "number" && Number.isInteger(row.bedrooms) && row.bedrooms >= 0 &&
    typeof row.bathrooms === "number" && Number.isFinite(row.bathrooms) && row.bathrooms >= 0 &&
    typeof row.square_feet === "number" && Number.isInteger(row.square_feet) && row.square_feet > 0
  );
}

/** Read only the public API; database credentials stay in the existing route. */
export async function loadPropertyListings(
  signal?: AbortSignal,
): Promise<Property[]> {
  const response = await fetch("/api/properties", { cache: "no-store", signal });

  if (!response.ok) throw new Error(loadError);

  const payload: unknown = await response.json();
  if (
    !payload || typeof payload !== "object" ||
    !("data" in payload) || !Array.isArray(payload.data)
  ) {
    throw new Error(loadError);
  }

  return payload.data.map((row: unknown): Property => {
    if (!isPublicProperty(row)) throw new Error(loadError);

    return {
      id: row.id,
      address: row.address,
      price: row.price,
      bedrooms: row.bedrooms,
      bathrooms: row.bathrooms,
      squareFeet: row.square_feet,
      imageSrc: "/property-placeholder.svg",
      imageAlt: "Illustrated placeholder; a property photograph is not available",
    };
  });
}
