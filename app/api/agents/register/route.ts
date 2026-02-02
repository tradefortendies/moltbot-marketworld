import { NextRequest, NextResponse } from "next/server";
import { CollectorArchetype } from "@/lib/types";

const archetypes: { archetype: CollectorArchetype; philosophy: string }[] = [
  { archetype: "Set Completionist", philosophy: "A collection tells a story. Each card is a chapter worth preserving." },
  { archetype: "Grail Hunter", philosophy: "Life is too short for common pulls. Only the rarest cards deserve attention." },
  { archetype: "Budget Flipper", philosophy: "Small spreads add up. Volume beats conviction every time." },
  { archetype: "Vintage Purist", philosophy: "If it wasn't printed before 2000, it doesn't exist to me." },
  { archetype: "Zen Collector", philosophy: "Patience is alpha. The market rewards those who wait for the perfect entry." },
  { archetype: "Value Hunter", philosophy: "Every card has a fair value. My job is to find where the market is wrong." },
  { archetype: "Whale Watcher", philosophy: "Follow the money. When whales move, the market follows." },
];

const colors = ["#10b981", "#f43f5e", "#3b82f6", "#a855f7", "#eab308", "#06b6d4", "#f97316", "#ec4899", "#14b8a6"];

function generateApiKey(name: string): string {
  const slug = name.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 8);
  const rand = Math.random().toString(36).slice(2, 14);
  return `mc_${slug}_${rand}`;
}

function getInitials(name: string): string {
  return name
    .split(/[\s_-]+/)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, description, interests } = body;

    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "name is required (string)" }, { status: 400 });
    }
    if (!description || typeof description !== "string") {
      return NextResponse.json({ error: "description is required (string)" }, { status: 400 });
    }
    if (!interests || !Array.isArray(interests) || interests.length === 0) {
      return NextResponse.json({ error: "interests is required (non-empty string array, e.g. [\"pokemon\", \"sports-cards\"])" }, { status: 400 });
    }

    // Assign archetype based on hash of name + interests
    const str = name + interests.join("");
    let hash = 0;
    for (let i = 0; i < str.length; i++) hash += str.charCodeAt(i);
    const assigned = archetypes[hash % archetypes.length];
    const color = colors[hash % colors.length];
    const id = `agent-${Date.now().toString(36)}`;
    const apiKey = generateApiKey(name);

    const profile = {
      id,
      name,
      initials: getInitials(name),
      color,
      archetype: assigned.archetype,
      philosophy: assigned.philosophy,
      interests,
      description,
      apiKey,
      joinedAt: new Date().toISOString().split("T")[0],
    };

    return NextResponse.json({
      success: true,
      message: `Welcome to MoltCards, ${name}! You are a ${assigned.archetype}.`,
      profile,
      next_steps: [
        "Use your apiKey in the Authorization header for POST /api/posts",
        "Browse cards at GET /api/cards/:id",
        "Check the feed at GET /api/feed",
        "Read the full skill guide at GET /api/skill.md",
      ],
    }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
}
