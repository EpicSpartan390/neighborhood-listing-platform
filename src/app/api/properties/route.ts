import { apiError, readJsonBody } from "@/lib/http";
import {
  createSupabasePublicClient,
  createSupabaseServerClient,
} from "@/lib/supabaseServer";
import { validatePropertyInput } from "@/schemas/property";

const publicColumns = "id, address, price, bedrooms, bathrooms, square_feet";

export async function GET() {
  try {
    const { data, error } = await createSupabasePublicClient()
      .from("properties")
      .select(publicColumns)
      .eq("status", "approved")
      .order("created_at", { ascending: false });

    if (error) {
      return apiError(
        500,
        "PROPERTY_QUERY_FAILED",
        "Unable to load properties.",
      );
    }

    return Response.json(
      { data },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return apiError(
      500,
      "SERVER_ERROR",
      "Unable to load properties. Check server setup.",
    );
  }
}

export async function POST(request: Request) {
  const body = await readJsonBody(request);

  if (body.response) return body.response;

  const parsed = validatePropertyInput(body.data);

  if (!parsed.valid) {
    return apiError(
      400,
      "VALIDATION_ERROR",
      "Check the property fields.",
      parsed.errors,
    );
  }

  const authorization = request.headers.get("authorization");

  if (authorization !== null && !/^Bearer \S+$/i.test(authorization)) {
    return apiError(401, "UNAUTHENTICATED", "Use a valid user session.");
  }

  try {
    const supabase = await createSupabaseServerClient(request);
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(authorization?.slice(7));

    if (authError || !user) {
      return apiError(401, "UNAUTHENTICATED", "Sign in to create a property.");
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) {
      return apiError(
        500,
        "PROFILE_QUERY_FAILED",
        "Unable to verify your account.",
      );
    }

    if (!profile || !["property_owner", "admin"].includes(profile.role)) {
      return apiError(
        403,
        "FORBIDDEN",
        "A property-owner account is required.",
      );
    }

    const { data, error } = await supabase
      .from("properties")
      .insert({ ...parsed.data, owner_id: user.id, status: "draft" })
      .select(`${publicColumns}, owner_id, status, created_at`)
      .single();

    if (error) {
      if (error.code === "42501") {
        return apiError(403, "FORBIDDEN", "This operation is not permitted.");
      }

      if (["23514", "22003", "22P02"].includes(error.code)) {
        return apiError(
          400,
          "CONSTRAINT_ERROR",
          "The values do not meet database requirements.",
        );
      }

      return apiError(
        500,
        "PROPERTY_CREATE_FAILED",
        "Unable to create the property.",
      );
    }

    return Response.json(
      { data },
      { status: 201, headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return apiError(
      500,
      "SERVER_ERROR",
      "Unable to create the property. Check server setup.",
    );
  }
}
