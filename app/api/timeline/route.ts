import { buildTimeline } from "@/lib/functions";
import { QueryPlan, AggregatedQueryPlan, Timeline } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest): Promise<NextResponse<Timeline>> {
  const body: { queryPlan: QueryPlan | AggregatedQueryPlan } = await req.json();
  const { queryPlan } = body;

  const timeline = buildTimeline(queryPlan);
  return NextResponse.json(timeline);
}
