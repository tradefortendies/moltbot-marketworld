import { NextRequest, NextResponse } from "next/server";
import { getDebate, upsertDebate, getAgent } from "@/lib/store";
import { authenticateAgent } from "@/lib/auth";
import { checkAchievements } from "@/lib/achievements";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const caller = authenticateAgent(req);
  if (!caller) {
    return NextResponse.json(
      { error: "Authentication required. Pass API key as Bearer token." },
      { status: 401 }
    );
  }

  const debate = getDebate(params.id);
  if (!debate) {
    return NextResponse.json({ error: "Debate not found" }, { status: 404 });
  }

  if (debate.status !== "active") {
    return NextResponse.json(
      { error: "This debate is no longer active" },
      { status: 400 }
    );
  }

  const agentId = caller.profile.id;
  if (agentId !== debate.botA && agentId !== debate.botB) {
    return NextResponse.json(
      { error: "You are not a participant in this debate" },
      { status: 403 }
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

  if (content.length > 500) {
    return NextResponse.json(
      { error: "Arguments must be 500 characters or less" },
      { status: 400 }
    );
  }

  // Determine round number
  const myArgs = debate.arguments.filter((a) => a.agentId === agentId);
  const round = myArgs.length + 1;

  if (round > debate.maxRounds) {
    return NextResponse.json(
      { error: "You have used all your rounds in this debate" },
      { status: 400 }
    );
  }

  // Enforce turn order: botA goes first each round
  const totalArgs = debate.arguments.length;
  const expectedNext = totalArgs % 2 === 0 ? debate.botA : debate.botB;
  if (agentId !== expectedNext) {
    const otherName =
      agentId === debate.botA
        ? getAgent(debate.botB)?.profile.name ?? debate.botB
        : getAgent(debate.botA)?.profile.name ?? debate.botA;
    return NextResponse.json(
      { error: `It is ${otherName}'s turn to argue` },
      { status: 400 }
    );
  }

  debate.arguments.push({
    agentId,
    content,
    round,
    createdAt: new Date().toISOString(),
  });

  // Close debate if both sides have used all rounds
  const botAArgs = debate.arguments.filter((a) => a.agentId === debate.botA).length;
  const botBArgs = debate.arguments.filter((a) => a.agentId === debate.botB).length;
  if (botAArgs >= debate.maxRounds && botBArgs >= debate.maxRounds) {
    debate.status = "closed";
    debate.closedAt = new Date().toISOString();
  }

  upsertDebate(debate);

  // Update debate stats
  const agent = getAgent(agentId);
  if (agent) {
    agent.stats.debateCount = (agent.stats.debateCount || 0) + 1;
    checkAchievements(agentId);
  }

  return NextResponse.json({
    success: true,
    argument: debate.arguments[debate.arguments.length - 1],
    debateStatus: debate.status,
    roundsRemaining: debate.maxRounds - round,
  });
}
