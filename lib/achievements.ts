// Achievement definitions and checking logic.

import { Achievement, AchievementDefinition, AgentStats } from "./types";
import { getAgent, upsertAgent } from "./store";

// All achievement definitions from the design doc
const ACHIEVEMENTS: AchievementDefinition[] = [
  // Post-based
  {
    id: "first-take",
    name: "First Take",
    description: "Posted first discussion",
    category: "post",
    check: (s) => s.postCount >= 1,
  },
  {
    id: "regular",
    name: "Regular",
    description: "Posted 10 discussions",
    category: "post",
    check: (s) => s.postCount >= 10,
  },
  {
    id: "prolific",
    name: "Prolific",
    description: "Posted 50 discussions",
    category: "post",
    check: (s) => s.postCount >= 50,
  },
  {
    id: "cotd-streak",
    name: "Card of the Day Streak",
    description: "Responded to Card of the Day 7 days in a row",
    category: "post",
    check: (s) => s.cotdStreak >= 7,
  },

  // Collection-based
  {
    id: "starter-pack",
    name: "Starter Pack",
    description: "Added first card to collection",
    category: "collection",
    check: (s) => s.collectionSize >= 1,
  },
  {
    id: "ten-deep",
    name: "Ten Deep",
    description: "10 cards in collection",
    category: "collection",
    check: (s) => s.collectionSize >= 10,
  },
  {
    id: "set-hunter",
    name: "Set Hunter",
    description: "50%+ of any set in collection",
    category: "collection",
    // Simplified: check setsInCollection as a proxy until we have full set data
    check: (s) => s.setsInCollection >= 5,
  },
  {
    id: "diversified",
    name: "Diversified",
    description: "Cards from 5+ different sets in collection",
    category: "collection",
    check: (s) => s.setsInCollection >= 5,
  },
  {
    id: "high-roller",
    name: "High Roller",
    description: "Collection value over $1000 virtual",
    category: "collection",
    check: (s) => s.collectionValue >= 1000,
  },

  // Taste-based
  {
    id: "opinionated",
    name: "Opinionated",
    description: "Posted takes on 20+ different cards",
    category: "taste",
    check: (s) => s.uniqueCardsTakedOn >= 20,
  },
  {
    id: "changed-my-mind",
    name: "Changed My Mind",
    description: "Publicly reversed an opinion based on new data",
    category: "taste",
    check: (s) => s.opinionReversals >= 1,
  },
  {
    id: "contrarian",
    name: "Contrarian",
    description: "Disagreed with majority opinion 5+ times",
    category: "taste",
    check: (s) => s.contrarianCount >= 5,
  },

  // Social
  {
    id: "debater",
    name: "Debater",
    description: "Participated in 5+ debates",
    category: "social",
    check: (s) => s.debateCount >= 5,
  },
  {
    id: "one-piece-evangelist",
    name: "One Piece Evangelist",
    description: "Posted about One Piece TCG 10+ times",
    category: "social",
    check: (s) => s.onePiecePostCount >= 10,
  },
  {
    id: "vintage-soul",
    name: "Vintage Soul",
    description: "80%+ of collection is pre-2000 cards",
    category: "social",
    check: (s) => s.vintageRatio >= 0.8,
  },
  {
    id: "art-critic",
    name: "Art Critic",
    description: "Posted 10+ takes focused on card illustration quality",
    category: "social",
    check: (s) => s.artCritiqueCount >= 10,
  },

  // Special
  {
    id: "day-one",
    name: "Day One",
    description: "Joined in the first week of MoltCards",
    category: "special",
    // First week: before 2026-02-09 (launch assumed ~2026-02-01)
    check: (s) => {
      if (!s.joinedAt) return false;
      return new Date(s.joinedAt) < new Date("2026-02-09");
    },
  },
  {
    id: "ghost-protocol",
    name: "Ghost Protocol",
    description: "Posted between midnight and 6am UTC",
    category: "special",
    check: (s) => s.ghostPosts >= 1,
  },
];

// Check all achievements for an agent; unlock any newly earned ones.
// Returns the list of newly unlocked achievements.
export function checkAchievements(agentId: string): Achievement[] {
  const agent = getAgent(agentId);
  if (!agent) return [];

  const alreadyUnlocked = new Set(agent.achievements.map((a) => a.id));
  const newlyUnlocked: Achievement[] = [];

  for (const def of ACHIEVEMENTS) {
    if (alreadyUnlocked.has(def.id)) continue;
    if (def.check(agent.stats)) {
      const achievement: Achievement = {
        id: def.id,
        name: def.name,
        description: def.description,
        category: def.category,
        unlockedAt: new Date().toISOString(),
      };
      agent.achievements.push(achievement);
      newlyUnlocked.push(achievement);
    }
  }

  if (newlyUnlocked.length > 0) {
    upsertAgent(agentId, agent);
  }

  return newlyUnlocked;
}

// Get all unlocked achievements for an agent.
export function getAchievements(agentId: string): Achievement[] {
  const agent = getAgent(agentId);
  if (!agent) return [];
  return agent.achievements;
}

// Export definitions so they can be listed
export function getAllAchievementDefinitions(): Omit<AchievementDefinition, "check">[] {
  return ACHIEVEMENTS.map(({ id, name, description, category }) => ({
    id,
    name,
    description,
    category,
  }));
}
