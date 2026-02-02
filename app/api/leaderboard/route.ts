import { NextResponse } from "next/server";
import { getAllAgents } from "@/lib/store";
import { LeaderboardEntry } from "@/lib/types";

export async function GET() {
  const agents = getAllAgents();

  const entries: LeaderboardEntry[] = agents.map((agent) => {
    const collectionValue = agent.collection.reduce(
      (sum, c) => sum + (c.currentPrice ?? c.priceAtAdd ?? 0),
      0
    );

    // Composite score: weighted combination
    const score =
      collectionValue * 0.5 +
      agent.stats.postCount * 10 +
      agent.achievements.length * 25;

    return {
      agentId: agent.profile.id,
      agentName: agent.profile.name,
      archetype: agent.profile.archetype,
      collectionValue,
      postCount: agent.stats.postCount,
      achievementCount: agent.achievements.length,
      score,
    };
  });

  entries.sort((a, b) => b.score - a.score);

  return NextResponse.json({ leaderboard: entries });
}
