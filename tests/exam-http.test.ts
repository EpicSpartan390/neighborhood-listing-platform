import { expect, it } from "vitest";

import { readJsonBody } from "../src/lib/http";

function request(body: string, extraHeaders: Record<string, string> = {}) {
  return new Request("https://example.com/api/properties", {
    method: "POST",
    body,
    headers: {
      "Content-Type": "application/json",
      ...extraHeaders,
    },
  });
}

it("accepts same-origin JSON", async () => {
  const result = await readJsonBody(
    request('{"price":42}', { Origin: "https://example.com" }),
  );

  expect(result.data).toEqual({ price: 42 });
});

it("rejects cross-origin writes", async () => {
  const result = await readJsonBody(
    request("{}", { Origin: "https://other.example" }),
  );

  expect(result.response?.status).toBe(403);
});

it("rejects non-JSON content types", async () => {
  const result = await readJsonBody(
    request("{}", { "Content-Type": "text/plain" }),
  );

  expect(result.response?.status).toBe(415);
});

it("reports malformed JSON as 400", async () => {
  expect((await readJsonBody(request("{"))).response?.status).toBe(400);
});

it("enforces the request body size limit", async () => {
  const body = JSON.stringify({ value: "x".repeat(17000) });

  expect((await readJsonBody(request(body))).response?.status).toBe(413);
});
