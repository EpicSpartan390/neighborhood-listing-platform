import { afterEach, expect, it, vi } from "vitest";

import { loadPropertyListings } from "../src/lib/propertyListings";

const row = {
  id: "fictional-listing",
  address: "123 Fictional Way, Santa Monica",
  price: 450000,
  bedrooms: 3,
  bathrooms: 1.5,
  square_feet: 1500,
};

afterEach(() => vi.unstubAllGlobals());

it("loads the public route and maps database fields without inventing a listing URL", async () => {
  const fetchMock = vi.fn().mockResolvedValue(Response.json({ data: [row] }));
  vi.stubGlobal("fetch", fetchMock);
  const controller = new AbortController();

  const properties = await loadPropertyListings(controller.signal);

  expect(fetchMock).toHaveBeenCalledWith("/api/properties", {
    cache: "no-store",
    signal: controller.signal,
  });
  expect(properties).toEqual([{
    id: row.id,
    address: row.address,
    price: row.price,
    bedrooms: row.bedrooms,
    bathrooms: row.bathrooms,
    squareFeet: 1500,
    imageSrc: "/property-placeholder.svg",
    imageAlt: "Illustrated placeholder; a property photograph is not available",
  }]);
  expect(properties[0]).not.toHaveProperty("listingUrl");
});

it("accepts a genuine empty result", async () => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(Response.json({ data: [] })));
  expect(await loadPropertyListings()).toEqual([]);
});

it("rejects failed HTTP requests without surfacing the server response body", async () => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(
    Response.json({ error: "private database detail" }, { status: 500 }),
  ));
  await expect(loadPropertyListings()).rejects.toThrow(
    "Unable to load properties. Please try again.",
  );
});

it("rejects network failures rather than presenting an empty database", async () => {
  vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("Failed to fetch")));
  await expect(loadPropertyListings()).rejects.toThrow("Failed to fetch");
});

it.each([
  null,
  {},
  { data: null },
  { data: {} },
  { data: [null] },
  { data: [{ ...row, square_feet: null }] },
  { data: [{ ...row, price: "450000" }] },
  { data: [{ ...row, bedrooms: 1.5 }] },
  { data: [{ ...row, address: "" }] },
])("rejects malformed successful payloads: %j", async (payload) => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(Response.json(payload)));
  await expect(loadPropertyListings()).rejects.toThrow(
    "Unable to load properties. Please try again.",
  );
});

it("rejects invalid JSON instead of displaying an empty list", async () => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("not JSON")));
  await expect(loadPropertyListings()).rejects.toThrow();
});

it("preserves an aborted request for the component cleanup to ignore", async () => {
  const aborted = new DOMException("Cancelled", "AbortError");
  vi.stubGlobal("fetch", vi.fn().mockRejectedValue(aborted));
  await expect(loadPropertyListings()).rejects.toBe(aborted);
});
