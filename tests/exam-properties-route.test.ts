import { beforeEach, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  publicClient: vi.fn(),
  serverClient: vi.fn(),
}));

vi.mock("@/lib/supabaseServer", () => ({
  createSupabasePublicClient: mocks.publicClient,
  createSupabaseServerClient: mocks.serverClient,
}));

import { GET, POST } from "../src/app/api/properties/route";

const validProperty = {
  address: "123 Maple Street",
  price: 400000,
  bedrooms: 3,
  bathrooms: 2,
  square_feet: 1500,
};

function request(payload: unknown) {
  return new Request("https://example.com/api/properties", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

beforeEach(() => vi.resetAllMocks());

it("validates before attempting a database insert", async () => {
  const response = await POST(
    request({ ...validProperty, status: "approved" }),
  );

  expect(response.status).toBe(400);
  expect((await response.json()).error.details[0]).toHaveProperty("keyword");
  expect(mocks.serverClient).not.toHaveBeenCalled();
});

it("rejects an unauthenticated creation", async () => {
  mocks.serverClient.mockResolvedValue({
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: null },
        error: null,
      }),
    },
  });

  expect((await POST(request(validProperty))).status).toBe(401);
});

it("rejects a malformed authorization header", async () => {
  const invalidRequest = request(validProperty);
  invalidRequest.headers.set("Authorization", "Basic ignored");

  expect((await POST(invalidRequest)).status).toBe(401);
  expect(mocks.serverClient).not.toHaveBeenCalled();
});

it("checks the profile role before allowing creation", async () => {
  const profile = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn().mockResolvedValue({
      data: { role: "public" },
      error: null,
    }),
  };
  const from = vi.fn().mockReturnValue(profile);

  mocks.serverClient.mockResolvedValue({
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: { id: "owner-a" } },
        error: null,
      }),
    },
    from,
  });

  expect((await POST(request(validProperty))).status).toBe(403);
  expect(from).toHaveBeenCalledTimes(1);
});

it("uses the verified owner and forces draft status", async () => {
  const profile = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn().mockResolvedValue({
      data: { role: "property_owner" },
      error: null,
    }),
  };
  const insert = vi.fn().mockReturnThis();
  const properties = {
    insert,
    select: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({
      data: { ...validProperty, owner_id: "owner-a", status: "draft" },
      error: null,
    }),
  };

  mocks.serverClient.mockResolvedValue({
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: { id: "owner-a" } },
        error: null,
      }),
    },
    from: (table: string) => (table === "profiles" ? profile : properties),
  });

  expect((await POST(request(validProperty))).status).toBe(201);
  expect(insert).toHaveBeenCalledWith({
    ...validProperty,
    owner_id: "owner-a",
    status: "draft",
  });
});

it("GET selects public columns and sponsor tiers for approved properties", async () => {
  const query = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockResolvedValue({ data: [], error: null }),
  };

  mocks.publicClient.mockReturnValue({
    from: vi.fn().mockReturnValue(query),
  });

  expect((await GET()).status).toBe(200);
  expect(query.select).toHaveBeenCalledWith(
    "id, address, price, bedrooms, bathrooms, square_feet, property_sponsors(sponsors(name, tier))",
  );
  expect(query.eq).toHaveBeenCalledWith("status", "approved");
  expect(mocks.serverClient).not.toHaveBeenCalled();
});

it("does not expose raw database errors", async () => {
  const query = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockResolvedValue({
      data: null,
      error: { message: "private database detail" },
    }),
  };

  mocks.publicClient.mockReturnValue({
    from: vi.fn().mockReturnValue(query),
  });

  const response = await GET();

  expect(response.status).toBe(500);
  expect(await response.text()).not.toContain("private database detail");
});
