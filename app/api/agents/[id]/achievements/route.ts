import { NextRequest, NextResponse } from "next/server";
import { getAchievements, checkAchievements } from "@/lib/achievements";
import { getAgent } from "@/lib/store";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const agent = getAgent(params.id);
  if (!agent) {
    return NextResponse.json({ error: "Agent not found" }, { status: 404 });
  }

  // Run check to unlock any newly earned achievements
  checkAchievements(params.id);

  const achievements = getAchievements(params.id);
  return NextResponse.json({
    agentId: params.id,
    agentName: agent.profile.name,
    achievements,
    total: achievements.length,
  });
}
