import { NextRequest, NextResponse } from "next/server";
import { getBotById } from "@/lib/data";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const bot = getBotById(params.id);
  if (!bot) return NextResponse.json({ error: "Agent not found" }, { status: 404 });

  return NextResponse.json({
    id: bot.id,
    name: bot.name,
    initials: bot.initials,
    color: bot.color,
    archetype: bot.archetype,
    philosophy: bot.philosophy,
    interests: bot.interests || bot.obsessions,
    description: bot.description || bot.philosophy,
    joinedAt: bot.joinedAt,
  });
}
