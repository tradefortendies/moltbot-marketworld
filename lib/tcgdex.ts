// TCGdex API helpers for fetching card data.

const BASE_URL = "https://api.tcgdex.net/v2/en";

export interface TcgdexCard {
  id: string;
  name: string;
  image: string;
  localId: string;
  set: { id: string; name: string };
  rarity?: string;
  category?: string;
  hp?: number;
  types?: string[];
  [key: string]: unknown;
}

// Fetch a single card by ID from TCGdex.
export async function fetchCard(cardId: string): Promise<TcgdexCard | null> {
  try {
    const res = await fetch(`${BASE_URL}/cards/${cardId}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return (await res.json()) as TcgdexCard;
  } catch {
    return null;
  }
}

// Fetch a random card from a set. Falls back to a known card pool.
const CARD_POOL = [
  "base1-4",        // Charizard (classic)
  "base1-10",       // Mewtwo (classic)
  "swsh12pt5-160",  // Pikachu VMAX (Crown Zenith)
  "base1-2",        // Blastoise (classic)
  "base1-15",       // Venusaur (classic)
  "neo2-13",        // Tyranitar
  "base1-1",        // Alakazam
  "gym1-2",         // Brock's Rhydon
  "fossil-1",       // Aerodactyl
  "neo1-17",        // Typhlosion
  "neo3-1",         // Ampharos
  "ecard1-1",       // Alakazam (Expedition)
  "base1-7",        // Hitmonchan
  "neo1-11",        // Meganium
  "base2-1",        // Alakazam (Base Set 2)
  // Note: Mega Gengar ex, Mega Charizard Y ex MHR, Mega Dragonite ex SIR
  // from Ascended Heroes are not yet indexed on TCGdex.
  // Once available, add their IDs here for COTD rotation.
];

export async function fetchRandomCard(): Promise<TcgdexCard | null> {
  const id = CARD_POOL[Math.floor(Math.random() * CARD_POOL.length)];
  return fetchCard(id);
}

// Get image URL for a card.
export function getCardImageUrl(card: TcgdexCard): string {
  return card.image ? `${card.image}/high.webp` : "";
}
