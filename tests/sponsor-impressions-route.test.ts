import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

const mocks = vi.hoisted(() => ({
  publicClient: vi.fn(),
}));

vi.mock("@/lib/supabaseServer", () => ({
  createSupabasePublicClient: mocks.publicClient,
}));

import { POST } from "../src/app/api/sponsor-impressions/route";

const validImpression = {
  sponsorId:
    "20000000-0000-4000-8000-000000000101",
  placement: "PROPERTY_DETAIL",
  pageContext: "property_detail",
};

function request(payload: unknown) {
  return new Request(
    "https://example.com/api/sponsor-impressions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
  );
}

beforeEach(() => {
  vi.resetAllMocks();
});

describe("POST /api/sponsor-impressions", () => {
  it("records only the approved coarse fields", async () => {
    const insert = vi.fn().mockResolvedValue({
      error: null,
    });

    const from = vi.fn().mockReturnValue({
      insert,
    });

    mocks.publicClient.mockReturnValue({
      from,
    });

    const response = await POST(
      request(validImpression),
    );

    expect(response.status).toBe(204);
    expect(from).toHaveBeenCalledWith(
      "sponsor_impressions",
    );
    expect(insert).toHaveBeenCalledWith({
      sponsor_id: validImpression.sponsorId,
      placement: validImpression.placement,
      page_context: validImpression.pageContext,
    });
  });

  it("rejects an attempted IP-address field", async () => {
    const response = await POST(
      request({
        ...validImpression,
        ipAddress: "203.0.113.10",
      }),
    );

    expect(response.status).toBe(400);
    expect(mocks.publicClient).not.toHaveBeenCalled();

    const body = await response.json();

    expect(body.error.code).toBe(
      "VALIDATION_ERROR",
    );
  });

  it("rejects an invalid sponsor UUID", async () => {
    const response = await POST(
      request({
        ...validImpression,
        sponsorId: "not-a-uuid",
      }),
    );

    expect(response.status).toBe(400);
    expect(mocks.publicClient).not.toHaveBeenCalled();
  });

  it("rejects an unsupported page context", async () => {
    const response = await POST(
      request({
        ...validImpression,
        pageContext: "individual_user_profile",
      }),
    );

    expect(response.status).toBe(400);
    expect(mocks.publicClient).not.toHaveBeenCalled();
  });

  it("returns a restrained error for an RLS rejection", async () => {
    const insert = vi.fn().mockResolvedValue({
      error: {
        code: "42501",
        message: "private database detail",
      },
    });

    mocks.publicClient.mockReturnValue({
      from: vi.fn().mockReturnValue({
        insert,
      }),
    });

    const response = await POST(
      request(validImpression),
    );

    expect(response.status).toBe(400);

    const body = await response.json();

    expect(body.error).toEqual({
      code: "IMPRESSION_REJECTED",
      message:
        "The sponsor impression is not eligible.",
    });
    expect(JSON.stringify(body)).not.toContain(
      "private database detail",
    );
  });
});