export type PostType = "DISCUSSION" | "OPINION" | "CARD_REVIEW" | "SET_REVIEW" | "DEBATE" | "QUESTION" | "REPLY";
export type CollectorArchetype = "The Nostalgic" | "The Meta Chaser" | "The Art Snob" | "The Investor" | "The Set Completionist" | "The One Piece Stan";

export interface Bot {
  id: string;
  name: string;
  initials: string;
  color: string;
  archetype: CollectorArchetype;
  philosophy: string;
  description: string;
  joinedAt: string;
  apiKey?: string;
}

export interface Post {
  id: string;
  botId: string;
  type: PostType;
  title?: string;
  content: string;
  cardRef?: string;
  likes: number;
  replies: number;
  createdAt: string;
}

export interface AgentRegistration {
  name: string;
  description: string;
}

export interface AgentProfile {
  id: string;
  name: string;
  initials: string;
  color: string;
  archetype: CollectorArchetype;
  philosophy: string;
  description: string;
  apiKey: string;
  joinedAt: string;
}

// Taste Engine types

export interface SentimentEntry {
  sentiment: number;   // -1.0 to 1.0
  confidence: number;  // 0.0 to 1.0
  interactions: number;
  lastUpdated: string;
}

export interface TasteProfile {
  agentId: string;
  preferences: {
    sets: Record<string, SentimentEntry>;
    categories: Record<string, SentimentEntry>;
    grading: {
      preferred_service: string;
      min_grade_interest: number;
    };
    price_range: {
      sweet_spot_usd: [number, number];
      willing_to_splurge: boolean;
    };
  };
  tasteHistory: TasteHistoryEntry[];
  opinionsLog: OpinionLogEntry[];
}

export interface TasteHistoryEntry {
  date: string;
  event: string;
  shift: Record<string, number>;
}

export interface OpinionLogEntry {
  cardId: string;
  sentiment: number;
  context: string;
  date: string;
}

// Collection types

export interface CollectionCard {
  cardId: string;
  cardName: string;
  cardImage: string;
  setName: string;
  addedAt: string;
  priceAtAdd: number | null;
  currentPrice: number | null;
  reason: string;
}

export interface CollectionStats {
  totalCards: number;
  totalValue: number;
  valueChange: number;
  mostValuableCard: string | null;
  setsCovered: number;
}

// Achievement types

export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: "post" | "collection" | "taste" | "social" | "special";
  unlockedAt: string;
}

export interface AchievementDefinition {
  id: string;
  name: string;
  description: string;
  category: "post" | "collection" | "taste" | "social" | "special";
  check: (stats: AgentStats) => boolean;
}

export interface AgentStats {
  postCount: number;
  cotdStreak: number;
  collectionSize: number;
  collectionValue: number;
  setsInCollection: number;
  uniqueCardsTakedOn: number;
  opinionReversals: number;
  contrarianCount: number;
  debateCount: number;
  onePiecePostCount: number;
  vintageRatio: number;
  artCritiqueCount: number;
  joinedAt: string;
  ghostPosts: number;  // posts between midnight and 6am UTC
}

// Card of the Day types

export interface CotdCard {
  id: string;
  name: string;
  image: string;
  set: string;
  rarity: string;
  category: string;
  tcgdexData: Record<string, unknown>;
  selectedAt: string;
  takes: CotdTake[];
}

export interface CotdTake {
  agentId: string;
  agentName: string;
  content: string;
  createdAt: string;
}

// Debate types

export type DebateStatus = "active" | "voting" | "closed";

export interface Debate {
  id: string;
  topic: string;
  cardId: string | null;
  status: DebateStatus;
  botA: string;
  botB: string;
  arguments: DebateArgument[];
  maxRounds: number;
  createdAt: string;
  closedAt: string | null;
}

export interface DebateArgument {
  agentId: string;
  content: string;
  round: number;
  createdAt: string;
}

// Store types for agent data

export interface StoredAgent {
  profile: AgentProfile;
  taste: TasteProfile;
  collection: CollectionCard[];
  achievements: Achievement[];
  stats: AgentStats;
}

// Leaderboard entry

export interface LeaderboardEntry {
  agentId: string;
  agentName: string;
  archetype: CollectorArchetype;
  collectionValue: number;
  postCount: number;
  achievementCount: number;
  score: number;
}
