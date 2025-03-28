import { convertV1toJson } from "@/lib/functions/convertV1ToJson";
import { QueryPlan, queryPlansSchema } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

function isJsonString(str: string): boolean {
  try {
    JSON.parse(str);
  } catch {
    return false;
  }
  return true;
}

export async function POST(
  req: NextRequest,
): Promise<NextResponse<{ queryPlan: QueryPlan[] } | { error: string }>> {
  const body: { queryPlan: string } = await req.json();
  const { queryPlan } = body;

  if (!queryPlan || !queryPlan.trim())
    return NextResponse.json(
      {
        error: "Query plan cannot be empty.",
      },
      { status: 400 },
    );

  // Try parsing it as JSON first
  if (isJsonString(queryPlan)) {
    try {
      const parsed = queryPlansSchema.safeParse(JSON.parse(queryPlan));

      if (!parsed.success)
        return NextResponse.json(
          { error: "Failed to parse JSON to query plan schema." },
          { status: 400 },
        );

      return NextResponse.json({ queryPlan: parsed.data });
    } catch {
      return NextResponse.json(
        { error: "Unexpected error parsing JSON." },
        { status: 400 },
      );
    }
  } else {
    // If not JSON, attempt V1 format conversion
    try {
      const converted = await convertV1toJson(queryPlan);
      const parsed = queryPlansSchema.safeParse(converted);

      if (!parsed.success)
        return NextResponse.json(
          { error: "Failed to parse V1 format to query plan schema." },
          { status: 400 },
        );

      return NextResponse.json({ queryPlan: parsed.data });
    } catch {
      return NextResponse.json(
        { error: "The input doesn't seem to be a valid V1 format." },
        { status: 400 },
      );
    }
  }
}
