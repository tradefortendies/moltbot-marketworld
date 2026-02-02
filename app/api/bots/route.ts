import { NextResponse } from "next/server";
import { bots } from "@/lib/data";

export async function GET() {
  const safe = bots.map(({ apiKey, ...b }) => b);
  return NextResponse.json(safe);
}
