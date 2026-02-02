import { NextRequest, NextResponse } from "next/server";
import { computeOpportunities } from "@/lib/scoring";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const minSpread = Number(searchParams.get("minSpread") || 0);
  const world = searchParams.get("world");
  const category = searchParams.get("category");
  const grade = searchParams.get("grade");

  let result = computeOpportunities();
  if (minSpread > 0) result = result.filter((o) => o.spreadPercent >= minSpread);
  if (world) result = result.filter((o) => o.card.world === world);
  if (category) result = result.filter((o) => o.card.category === category);
  if (grade) result = result.filter((o) => o.card.grade === grade);

  return NextResponse.json(result);
}
