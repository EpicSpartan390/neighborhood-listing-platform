import { apiError } from "@/lib/http";
import {
  unsafeSponsorUrlError,
  validateSponsorDestination,
} from "@/lib/safeSponsorUrl";
import { createSupabasePublicClient } from "@/lib/supabaseServer";

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function GET(request: Request) {
  const sponsorId = new URL(
    request.url,
  ).searchParams.get("sponsorId");

  if (!sponsorId || !uuidPattern.test(sponsorId)) {
    return apiError(
      400,
      "INVALID_SPONSOR_ID",
      "Use a valid sponsor ID.",
    );
  }

  try {
    const { data, error } =
      await createSupabasePublicClient()
        .from("sponsors")
        .select("destination_url")
        .eq("id", sponsorId)
        .eq("status", "APPROVED")
        .eq("active_status", true)
        .maybeSingle();

    if (error) {
      return apiError(
        500,
        "SPONSOR_QUERY_FAILED",
        "Unable to verify the sponsor destination.",
      );
    }

    if (!data) {
      return apiError(
        404,
        "SPONSOR_NOT_AVAILABLE",
        "The sponsor is not available.",
      );
    }

    const destination = validateSponsorDestination(
      data.destination_url,
    );

    if (!destination.valid) {
      return apiError(
        400,
        unsafeSponsorUrlError.code,
        unsafeSponsorUrlError.message,
      );
    }

    return new Response(null, {
      status: 302,
      headers: {
        Location: destination.url,
        "Cache-Control": "no-store",
        "Referrer-Policy": "no-referrer",
      },
    });
  } catch {
    return apiError(
      500,
      "SERVER_ERROR",
      "Unable to verify the sponsor destination. Check server setup.",
    );
  }
}