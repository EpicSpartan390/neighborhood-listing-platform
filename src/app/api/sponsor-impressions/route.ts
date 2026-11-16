import { apiError, readJsonBody } from "@/lib/http";
import { createSupabasePublicClient } from "@/lib/supabaseServer";
import { validateSponsorImpressionInput } from "@/schemas/sponsorImpression";

export async function POST(request: Request) {
  const body = await readJsonBody(request);

  if (body.response) {
    return body.response;
  }

  const parsed = validateSponsorImpressionInput(
    body.data,
  );

  if (!parsed.valid) {
    return apiError(
      400,
      "VALIDATION_ERROR",
      "Check the sponsor impression fields.",
      parsed.errors,
    );
  }

  try {
    const { error } = await createSupabasePublicClient()
      .from("sponsor_impressions")
      .insert({
        sponsor_id: parsed.data.sponsorId,
        placement: parsed.data.placement,
        page_context: parsed.data.pageContext,
      });

    if (error) {
      if (
        ["23503", "23514", "42501"].includes(
          error.code,
        )
      ) {
        return apiError(
          400,
          "IMPRESSION_REJECTED",
          "The sponsor impression is not eligible.",
        );
      }

      return apiError(
        500,
        "IMPRESSION_CREATE_FAILED",
        "Unable to record the sponsor impression.",
      );
    }

    return new Response(null, {
      status: 204,
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return apiError(
      500,
      "SERVER_ERROR",
      "Unable to record the sponsor impression. Check server setup.",
    );
  }
}
