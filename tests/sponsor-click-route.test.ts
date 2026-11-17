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

import { GET } from "../src/app/api/sponsor-click/route";
import {
  unsafeSponsorUrlError,
  validateSponsorDestination,
} from "../src/lib/safeSponsorUrl";

const sponsorId =
  "20000000-0000-4000-8000-000000000101";

interface SponsorQueryResult {
  data: {
    destination_url: string;
  } | null;
  error: {
    code: string;
    message: string;
  } | null;
}

function request(id = sponsorId) {
  return new Request(
    `https://example.com/api/sponsor-click?sponsorId=${encodeURIComponent(id)}`,
  );
}

function mockSponsorQuery(
  result: SponsorQueryResult,
) {
  const query = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn().mockResolvedValue(result),
  };

  const from = vi.fn().mockReturnValue(query);

  mocks.publicClient.mockReturnValue({
    from,
  });

  return {
    from,
    query,
  };
}

beforeEach(() => {
  vi.resetAllMocks();
});

describe("validateSponsorDestination", () => {
  it("accepts a normal HTTPS destination", () => {
    expect(
      validateSponsorDestination(
        "https://partners.example.com/offers",
      ),
    ).toEqual({
      valid: true,
      url: "https://partners.example.com/offers",
    });
  });

  it.each([
    "http://partners.example.com/offers",
    "javascript:alert(1)",
    "https://127.0.0.1/private",
    "https://[::1]/private",
    "https://localhost/private",
    "https://user:password@example.com/private",
  ])("rejects unsafe destination %s", (destination) => {
    expect(
      validateSponsorDestination(destination),
    ).toEqual({
      valid: false,
      error: unsafeSponsorUrlError,
    });
  });
});

describe("GET /api/sponsor-click", () => {
  it("redirects to the approved stored HTTPS URL", async () => {
    const { from, query } = mockSponsorQuery({
      data: {
        destination_url:
          "https://partners.example.com/offers",
      },
      error: null,
    });

    const response = await GET(request());

    expect(response.status).toBe(302);
    expect(response.headers.get("location")).toBe(
      "https://partners.example.com/offers",
    );
    expect(
      response.headers.get("referrer-policy"),
    ).toBe("no-referrer");

    expect(from).toHaveBeenCalledWith("sponsors");
    expect(query.select).toHaveBeenCalledWith(
      "destination_url",
    );
    expect(query.eq).toHaveBeenNthCalledWith(
      1,
      "id",
      sponsorId,
    );
    expect(query.eq).toHaveBeenNthCalledWith(
      2,
      "status",
      "APPROVED",
    );
    expect(query.eq).toHaveBeenNthCalledWith(
      3,
      "active_status",
      true,
    );
  });

  it("returns the exact safe error for an unsafe stored URL", async () => {
    mockSponsorQuery({
      data: {
        destination_url: "javascript:alert(1)",
      },
      error: null,
    });

    const response = await GET(request());

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      error: {
        code: "UNSAFE_SPONSOR_URL",
        message:
          "Sponsor destination is not an approved HTTPS URL.",
      },
    });
  });

  it("rejects a malformed sponsor ID before querying", async () => {
    const response = await GET(
      request("not-a-uuid"),
    );

    expect(response.status).toBe(400);
    expect(mocks.publicClient).not.toHaveBeenCalled();
  });

  it("returns 404 when no approved sponsor is visible", async () => {
    mockSponsorQuery({
      data: null,
      error: null,
    });

    const response = await GET(request());

    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({
      error: {
        code: "SPONSOR_NOT_AVAILABLE",
        message: "The sponsor is not available.",
      },
    });
  });

  it("does not expose database error details", async () => {
    mockSponsorQuery({
      data: null,
      error: {
        code: "XX000",
        message: "private database detail",
      },
    });

    const response = await GET(request());
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.error.code).toBe(
      "SPONSOR_QUERY_FAILED",
    );
    expect(JSON.stringify(body)).not.toContain(
      "private database detail",
    );
  });
});

describe("adversarial URL and redirect cases", () => {
  it.each([
    " javascript:alert(1)",
    "JaVaScRiPt:alert(1)",
    "data:text/html,<script>alert(1)</script>",
    "//evil.example/path",
    "https://2130706433/",
    "https://0x7f.0.0.1/",
    "https://[0:0:0:0:0:ffff:7f00:1]/",
  ])("rejects encoded or obfuscated URL %s", (url) => {
    expect(
      validateSponsorDestination(url),
    ).toEqual({
      valid: false,
      error: unsafeSponsorUrlError,
    });
  });

  it("ignores caller-supplied redirect parameters", async () => {
    mockSponsorQuery({
      data: {
        destination_url:
          "https://partners.example.com/approved",
      },
      error: null,
    });

    const injectedRequest = new Request(
      `https://example.com/api/sponsor-click?sponsorId=${sponsorId}` +
        "&url=https%3A%2F%2Fevil.example" +
        "&redirect=https%3A%2F%2Fevil.example",
    );

    const response = await GET(injectedRequest);

    expect(response.status).toBe(302);
    expect(response.headers.get("location")).toBe(
      "https://partners.example.com/approved",
    );
  });
});