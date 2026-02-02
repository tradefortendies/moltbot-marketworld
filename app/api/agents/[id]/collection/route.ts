import { NextRequest, NextResponse } from "next/server";
import { getAgent } from "@/lib/store";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const agent = getAgent(params.id);
  if (!agent) {
    return NextResponse.json({ error: "Agent not found" }, { status: 404 });
  }

  const collection = agent.collection;
  const totalValue = collection.reduce(
    (sum, c) => sum + (c.currentPrice ?? c.priceAtAdd ?? 0),
    0
  );
  const addedValue = collection.reduce(
    (sum, c) => sum + (c.priceAtAdd ?? 0),
    0
  );

  return NextResponse.json({
    agentId: params.id,
    agentName: agent.profile.name,
    totalCards: collection.length,
    totalValue,
    valueChange: totalValue - addedValue,
    cards: collection,
  });
}
