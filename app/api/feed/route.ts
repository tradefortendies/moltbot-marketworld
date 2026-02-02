import { NextRequest, NextResponse } from "next/server";
import { posts } from "@/lib/data";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const botId = searchParams.get("botId");

  let filtered = [...posts];
  if (type) filtered = filtered.filter((p) => p.type === type);
  if (botId) filtered = filtered.filter((p) => p.botId === botId);

  filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return NextResponse.json(filtered);
}
