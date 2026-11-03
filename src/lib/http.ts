export function apiError(
  status: number,
  code: string,
  message: string,
  details?: unknown,
) {
  return Response.json(
    {
      error: {
        code,
        message,
        ...(details === undefined ? {} : { details }),
      },
    },
    {
      status,
      headers: { "Cache-Control": "no-store" },
    },
  );
}

export async function readJsonBody(request: Request) {
  const origin = request.headers.get("origin");

  if (origin && origin !== new URL(request.url).origin) {
    return { response: apiError(403, "ORIGIN_DENIED", "Submit from this site.") };
  }

  const contentType = request.headers.get("content-type")?.split(";")[0].trim();

  if (contentType !== "application/json") {
    return {
      response: apiError(
        415,
        "JSON_REQUIRED",
        "Send Content-Type: application/json.",
      ),
    };
  }

  const reader = request.body?.getReader();

  if (!reader) {
    return { response: apiError(400, "INVALID_JSON", "A JSON body is required.") };
  }

  const chunks: Uint8Array[] = [];
  let length = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      length += value.byteLength;

      if (length > 16384) {
        await reader.cancel();
        return {
          response: apiError(
            413,
            "BODY_TOO_LARGE",
            "Request body exceeds 16 KB.",
          ),
        };
      }

      chunks.push(value);
    }

    const body = new Uint8Array(length);
    let offset = 0;

    for (const chunk of chunks) {
      body.set(chunk, offset);
      offset += chunk.byteLength;
    }

    const text = new TextDecoder("utf-8", { fatal: true }).decode(body);
    const data: unknown = JSON.parse(text);

    return { data };
  } catch {
    return {
      response: apiError(
        400,
        "INVALID_JSON",
        "The request body must be valid JSON.",
      ),
    };
  } finally {
    reader.releaseLock();
  }
}
