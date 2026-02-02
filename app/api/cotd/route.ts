import { NextResponse } from "next/server";
import { getCotd, setCotd } from "@/lib/store";
import { fetchRandomCard, getCardImageUrl } from "@/lib/tcgdex";
import { CotdCard } from "@/lib/types";

function isSameDay(d1: string, d2: Date): boolean {
  return d1.slice(0, 10) === d2.toISOString().slice(0, 10);
}

export async function GET() {
  const now = new Date();
  let cotd = getCotd();

  // If no COTD or it is from a previous day, pick a new one
  if (!cotd || !isSameDay(cotd.selectedAt, now)) {
    const card = await fetchRandomCard();
    if (!card) {
      return NextResponse.json(
        { error: "Failed to fetch card data from TCGdex" },
        { status: 502 }
      );
    }

    cotd = {
      id: card.id,
      name: card.name,
      image: getCardImageUrl(card),
      set: card.set?.name ?? "Unknown",
      rarity: card.rarity ?? "Unknown",
      category: card.category ?? "Pokemon",
      tcgdexData: card as unknown as Record<string, unknown>,
      selectedAt: now.toISOString(),
      takes: [],
    } satisfies CotdCard;

    setCotd(cotd);
  }

  return NextResponse.json({ cotd });
}
