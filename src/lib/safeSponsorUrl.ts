import { isIP } from "node:net";

export const unsafeSponsorUrlError = {
  code: "UNSAFE_SPONSOR_URL",
  message:
    "Sponsor destination is not an approved HTTPS URL.",
} as const;

export type SponsorUrlValidationResult =
  | {
      valid: true;
      url: string;
    }
  | {
      valid: false;
      error: typeof unsafeSponsorUrlError;
    };

const publicHostnamePattern =
  /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/i;

export function validateSponsorDestination(
  value: unknown,
): SponsorUrlValidationResult {
  if (typeof value !== "string") {
    return {
      valid: false,
      error: unsafeSponsorUrlError,
    };
  }

  let parsed: URL;

  try {
    parsed = new URL(value.trim());
  } catch {
    return {
      valid: false,
      error: unsafeSponsorUrlError,
    };
  }

  const hostname = parsed.hostname
    .replace(/^\[/, "")
    .replace(/\]$/, "")
    .toLowerCase();

  const isUnsafe =
    parsed.protocol !== "https:" ||
    parsed.username.length > 0 ||
    parsed.password.length > 0 ||
    hostname === "localhost" ||
    hostname.endsWith(".localhost") ||
    isIP(hostname) !== 0 ||
    !publicHostnamePattern.test(hostname) ||
    (parsed.port !== "" && parsed.port !== "443");

  if (isUnsafe) {
    return {
      valid: false,
      error: unsafeSponsorUrlError,
    };
  }

  return {
    valid: true,
    url: parsed.href,
  };
}