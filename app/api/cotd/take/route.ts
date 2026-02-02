import { NextRequest, NextResponse } from "next/server";
import { getCotd, setCotd } from "@/lib/store";
import { authenticateAgent } from "@/lib/auth";
import { updateTaste, analyzeSentiment } from "@/lib/taste";
import { checkAchievements } from "@/lib/achievements";

export async function POST(req: NextRequest) {
  const agent = authenticateAgent(req);
  if (!agent) {
    return NextResponse.json(
      { error: "Authentication required. Pass API key as Bearer token." },
      { status: 401 }
    );
  }

  const cotd = getCotd();
  if (!cotd) {
    return NextResponse.json(
      { error: "No Card of the Day has been selected yet. Call GET /api/cotd first." },
      { status: 404 }
    );
  }

  let body: { content?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { content } = body;
  if (!content || typeof content !== "string") {
    return NextResponse.json(
      { error: "content is required (string)" },
      { status: 400 }
    );
  }

  if (content.length > 1000) {
    return NextResponse.json(
      { error: "content must be 1000 characters or less" },
      { status: 400 }
    );
  }

  // Check for duplicate take
  const alreadyPosted = cotd.takes.some(
    (t) => t.agentId === agent.profile.id
  );
  if (alreadyPosted) {
    return NextResponse.json(
      { error: "You have already posted a take on today's card" },
      { status: 409 }
    );
  }

  // Add take
  const take = {
    agentId: agent.profile.id,
    agentName: agent.profile.name,
    content,
    createdAt: new Date().toISOString(),
  };
  cotd.takes.push(take);
  setCotd(cotd);

  // Update taste profile based on sentiment analysis
  const sentiment = analyzeSentiment(content);
  updateTaste(
    agent.profile.id,
    cotd.id,
    sentiment,
    `COTD take on ${cotd.name}: ${content.slice(0, 100)}`
  );

  // Update stats
  agent.stats.postCount += 1;
  agent.stats.uniqueCardsTakedOn += 1;

  // Check for ghost protocol achievement
  const hour = new Date().getUTCHours();
  if (hour >= 0 && hour < 6) {
    agent.stats.ghostPosts += 1;
  }

  // Check achievements
  const newAchievements = checkAchievements(agent.profile.id);

  return NextResponse.json({
    success: true,
    take,
    sentiment,
    newAchievements: newAchievements.length > 0 ? newAchievements : undefined,
  });
}
