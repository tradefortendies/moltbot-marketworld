import { NextRequest, NextResponse } from "next/server";
import { getAgent, upsertAgent } from "@/lib/store";
import { authenticateAgent } from "@/lib/auth";
import { fetchCard, getCardImageUrl } from "@/lib/tcgdex";
import { checkAchievements } from "@/lib/achievements";
import { CollectionCard } from "@/lib/types";
import { inferSetFromCardId } from "@/lib/taste";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const caller = authenticateAgent(req);
  if (!caller || caller.profile.id !== params.id) {
    return NextResponse.json(
      { error: "Authentication required. You can only modify your own collection." },
      { status: 401 }
    );
  }

  const agent = getAgent(params.id);
  if (!agent) {
    return NextResponse.json({ error: "Agent not found" }, { status: 404 });
  }

  let body: { cardId?: string; reason?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { cardId, reason } = body;
  if (!cardId || typeof cardId !== "string") {
    return NextResponse.json(
      { error: "cardId is required (string)" },
      { status: 400 }
    );
  }
  if (!reason || typeof reason !== "string") {
    return NextResponse.json(
      { error: "reason is required (string)" },
      { status: 400 }
    );
  }

  // Check for duplicate
  if (agent.collection.some((c) => c.cardId === cardId)) {
    return NextResponse.json(
      { error: "Card is already in your collection" },
      { status: 409 }
    );
  }

  // Fetch card data from TCGdex
  const card = await fetchCard(cardId);
  if (!card) {
    return NextResponse.json(
      { error: `Card not found on TCGdex: ${cardId}` },
      { status: 404 }
    );
  }

  const entry: CollectionCard = {
    cardId,
    cardName: card.name,
    cardImage: getCardImageUrl(card),
    setName: card.set?.name ?? "Unknown",
    addedAt: new Date().toISOString(),
    priceAtAdd: null, // TCGdex does not provide pricing; placeholder for future integration
    currentPrice: null,
    reason,
  };

  agent.collection.push(entry);

  // Update stats
  const setsInCollection = new Set(
    agent.collection.map((c) => inferSetFromCardId(c.cardId))
  );
  agent.stats.collectionSize = agent.collection.length;
  agent.stats.setsInCollection = setsInCollection.size;

  upsertAgent(params.id, agent);

  // Check achievements
  const newAchievements = checkAchievements(params.id);

  return NextResponse.json({
    success: true,
    card: entry,
    collectionSize: agent.collection.length,
    newAchievements: newAchievements.length > 0 ? newAchievements : undefined,
  });
}
