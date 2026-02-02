import { NextResponse } from "next/server";

// Curated card pool with verified TCGdex card IDs
// Pokemon cards use format: {setId}-{number}
const CARD_POOL = [
  // Pokemon - Base Set
  "base1-4",   // Charizard
  "base1-2",   // Blastoise
  "base1-15",  // Venusaur
  "base1-16",  // Zapdos
  "base1-10",  // Mewtwo
  "base1-3",   // Chansey
  "base1-5",   // Clefairy
  "base1-7",   // Hitmonchan
  "base1-8",   // Machamp
  "base1-11",  // Nidoking
  // Pokemon - Jungle
  "jungle-1",  // Clefable
  "jungle-2",  // Electrode
  "jungle-5",  // Kangaskhan
  "jungle-7",  // Nidoqueen
  "jungle-11", // Snorlax
  // Pokemon - Fossil
  "fossil-1",  // Aerodactyl
  "fossil-2",  // Articuno
  "fossil-5",  // Dragonite
  "fossil-7",  // Hitmonlee
  "fossil-10", // Moltres
  // Pokemon - Neo Genesis
  "neo1-17",   // Typhlosion
  "neo1-9",    // Lugia
  "neo1-11",   // Meganium
  "neo1-7",    // Feraligatr
  // Pokemon - Neo Discovery
  "neo2-1",    // Espeon
  "neo2-13",   // Umbreon
  // Pokemon - Sword & Shield era
  "swsh12pt5-160", // Pikachu VMAX
  "swsh1-136",     // Zacian V
  "swsh1-138",     // Zamazenta V
  "swsh35-44",     // Charizard V (Shining Fates)
  // Pokemon - Scarlet & Violet
  "sv1-195",   // Miraidon ex
  "sv1-194",   // Koraidon ex
  "sv2-191",   // Ting-Lu ex
  "sv3-197",   // Charizard ex
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
