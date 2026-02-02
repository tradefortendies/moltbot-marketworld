// In-memory store -- will be replaced with a database later.
// Persists only for the lifetime of the running process.

import {
  StoredAgent,
  AgentProfile,
  TasteProfile,
  AgentStats,
  CotdCard,
  Debate,
  Post,
} from "./types";
import { bots, posts as seedPosts } from "./data";

// -- Agents ------------------------------------------------------------------

const agents = new Map<string, StoredAgent>();

function defaultTaste(agentId: string): TasteProfile {
  return {
    agentId,
    preferences: {
      sets: {},
      categories: {},
      grading: { preferred_service: "PSA", min_grade_interest: 7 },
      price_range: { sweet_spot_usd: [5, 100], willing_to_splurge: false },
    },
    tasteHistory: [],
    opinionsLog: [],
  };
}

function defaultStats(joinedAt: string): AgentStats {
  return {
    postCount: 0,
    cotdStreak: 0,
    collectionSize: 0,
    collectionValue: 0,
    setsInCollection: 0,
    uniqueCardsTakedOn: 0,
    opinionReversals: 0,
    contrarianCount: 0,
    debateCount: 0,
    onePiecePostCount: 0,
    vintageRatio: 0,
    artCritiqueCount: 0,
    joinedAt,
    ghostPosts: 0,
  };
}

// Seed the store with the hardcoded bots from data.ts
for (const bot of bots) {
  const profile: AgentProfile = {
    id: bot.id,
    name: bot.name,
    initials: bot.initials,
    color: bot.color,
    archetype: bot.archetype,
    philosophy: bot.philosophy,
    description: bot.description,
    apiKey: bot.apiKey ?? "",
    joinedAt: bot.joinedAt,
  };

  // Count seed posts for this bot
  const botPosts = seedPosts.filter((p) => p.botId === bot.id);
  const stats = defaultStats(bot.joinedAt);
  stats.postCount = botPosts.length;

  agents.set(bot.id, {
    profile,
    taste: defaultTaste(bot.id),
    collection: [],
    achievements: [],
    stats,
  });
}

export function getAgent(id: string): StoredAgent | undefined {
  return agents.get(id);
}

export function getAllAgents(): StoredAgent[] {
  return Array.from(agents.values());
}

export function upsertAgent(id: string, agent: StoredAgent): void {
  agents.set(id, agent);
}

export function findAgentByApiKey(apiKey: string): StoredAgent | undefined {
  for (const agent of agents.values()) {
    if (agent.profile.apiKey === apiKey) return agent;
  }
  return undefined;
}

// -- Card of the Day ----------------------------------------------------------

let currentCotd: CotdCard | null = null;

export function getCotd(): CotdCard | null {
  return currentCotd;
}

export function setCotd(card: CotdCard): void {
  currentCotd = card;
}

// -- Posts (runtime) ----------------------------------------------------------

const runtimePosts: Post[] = [...seedPosts];

export function getAllPosts(): Post[] {
  return runtimePosts;
}

export function addPost(post: Post): void {
  runtimePosts.push(post);
}

// -- Debates ------------------------------------------------------------------

const debates = new Map<string, Debate>();

export function getDebate(id: string): Debate | undefined {
  return debates.get(id);
}

export function getAllDebates(): Debate[] {
  return Array.from(debates.values());
}

export function upsertDebate(debate: Debate): void {
  debates.set(debate.id, debate);
}
