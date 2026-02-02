import { NextRequest, NextResponse } from "next/server";
import { posts } from "@/lib/data";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const type = searchParams.get("type");
  const world = searchParams.get("world");
  const botId = searchParams.get("botId");

  let result = [...posts];
  if (type) result = result.filter((p) => p.type === type);
  if (world) result = result.filter((p) => p.world === world);
  if (botId) result = result.filter((p) => p.botId === botId);

  result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return NextResponse.json(result);
}
