import { NextRequest, NextResponse } from "next/server";
import { getBotById, getCardById } from "@/lib/data";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const bot = getBotById(params.id);
  if (!bot) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const watchlist = bot.watchlistCardIds.map(getCardById).filter(Boolean);
  return NextResponse.json({ bot, watchlist });
}
