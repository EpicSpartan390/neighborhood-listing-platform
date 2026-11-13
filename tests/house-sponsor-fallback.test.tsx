import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import HouseSponsorFallback from "../src/components/HouseSponsorFallback";

describe("HouseSponsorFallback", () => {
  it("identifies itself as a non-sponsored community message", () => {
    const html = renderToStaticMarkup(
      <HouseSponsorFallback placementLabel="the property" />,
    );

    expect(html).toContain(
      'aria-label="Community message"',
    );
    expect(html).toContain("Community Message");
    expect(html).toContain(
      "No local sponsor is available",
    );
    expect(html).toContain(
      "not a paid or sponsored placement",
    );
    expect(html).not.toContain("Sponsored Partner");
  });
});
