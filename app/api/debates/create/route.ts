import { NextRequest, NextResponse } from "next/server";
import { getAllAgents, upsertDebate, getAgent } from "@/lib/store";
import { compareTaste } from "@/lib/taste";
import { Debate } from "@/lib/types";

const DEBATE_TOPICS = [
  "Is this card overpriced or undervalued?",
  "Which is the better investment: vintage or modern?",
  "PSA vs BGS vs CGC -- which grading service matters most?",
  "Pokemon vs One Piece -- which TCG has better long-term value?",
  "Where should new collectors start: vintage or modern?",
];

export async function POST(req: NextRequest) {
  let body: { topic?: string; cardId?: string } = {};
  try {
    body = await req.json();
  } catch {
    // No body is fine -- we will auto-generate topic
  }

  const topic =
    body.topic ??
    DEBATE_TOPICS[Math.floor(Math.random() * DEBATE_TOPICS.length)];
  const cardId = body.cardId ?? null;

  // Find two agents with maximum taste divergence
  const agents = getAllAgents();
  if (agents.length < 2) {
    return NextResponse.json(
      { error: "Need at least 2 registered agents to create a debate" },
      { status: 400 }
    );
  }

  let bestPair: [string, string] = [agents[0].profile.id, agents[1].profile.id];
  let maxDivergence = 0;

  for (let i = 0; i < agents.length; i++) {
    for (let j = i + 1; j < agents.length; j++) {
      const div = compareTaste(
        agents[i].profile.id,
        agents[j].profile.id
      );
      if (div !== null && div > maxDivergence) {
        maxDivergence = div;
        bestPair = [agents[i].profile.id, agents[j].profile.id];
      }
    }
  }

  // If no taste divergence, pick random pair
  if (maxDivergence === 0) {
    const shuffled = agents.sort(() => Math.random() - 0.5);
    bestPair = [shuffled[0].profile.id, shuffled[1].profile.id];
  }

  const debate: Debate = {
    id: `debate-${Date.now().toString(36)}`,
    topic,
    cardId,
    status: "active",
    botA: bestPair[0],
    botB: bestPair[1],
    arguments: [],
    maxRounds: 3,
    createdAt: new Date().toISOString(),
    closedAt: null,
  };

  upsertDebate(debate);

  const botAProfile = getAgent(bestPair[0])?.profile;
  const botBProfile = getAgent(bestPair[1])?.profile;

  return NextResponse.json({
    success: true,
    debate: {
      ...debate,
      botAName: botAProfile?.name ?? bestPair[0],
      botBName: botBProfile?.name ?? bestPair[1],
      divergenceScore: maxDivergence,
    },
  }, { status: 201 });
}
