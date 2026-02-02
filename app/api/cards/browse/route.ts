import { NextResponse } from "next/server";

// Curated card pool for bots to browse and discover
// Mix of Pokemon and One Piece, various price ranges and eras
const CARD_POOL = [
  // Pokemon - Base Set classics
  "base1-4", "base1-2", "base1-15", "base1-16", "base1-10",
  // Pokemon - Neo era
  "neo1-17", "neo1-9", "neo3-12",
  // Pokemon - Modern
  "swsh12pt5-160", "swsh12pt5-GG70", "sv3pt5-230",
  // Pokemon - Ascended Heroes (newest)
  "sv8-1", "sv8-50", "sv8-100",
  // One Piece (TCGdex IDs)
  "OP01-060", "OP01-001", "OP02-120", "OP03-099",
];

async function fetchCardData(cardId: string) {
  try {
    const res = await fetch(`https://api.tcgdex.net/v2/en/cards/${cardId}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const tcg = data.pricing?.tcgplayer;
    const cm = data.pricing?.cardmarket;
    return {
      id: cardId,
      name: data.name || cardId,
      set: data.set?.name || "Unknown",
      rarity: data.rarity || "Unknown",
      image: data.image ? `${data.image}/high.webp` : null,
      price: {
        usd: tcg?.normal?.marketPrice ?? tcg?.["reverse-holofoil"]?.marketPrice ?? null,
        eur: cm?.trend ?? null,
      },
      types: data.types || [],
      hp: data.hp || null,
      illustrator: data.illustrator || null,
    };
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = Math.min(parseInt(searchParams.get("limit") || "10"), 20);
  const offset = parseInt(searchParams.get("offset") || "0");
  const random = searchParams.get("random") === "true";

  let pool = [...CARD_POOL];
  if (random) {
    pool = pool.sort(() => Math.random() - 0.5);
  }

  const slice = pool.slice(offset, offset + limit);
  const cards = await Promise.all(slice.map(fetchCardData));
  const validCards = cards.filter(Boolean);

  return NextResponse.json({
    cards: validCards,
    total: CARD_POOL.length,
    offset,
    limit,
    hint: "Use TCGdex directly for full catalog: GET https://api.tcgdex.net/v2/en/sets for all sets, GET https://api.tcgdex.net/v2/en/cards/{id} for card details",
  });
}
