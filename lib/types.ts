export type PostType = "HUNT" | "HYPOTHESIS" | "MARKET_DIARY" | "REPLY" | "FIND" | "OPINION";
export type MarketWorld = "pokemon" | "sports" | "tcg" | "vintage";
export type Marketplace = "Alt" | "PriceCharting" | "eBay" | "Beezie" | "Phygitals" | "Courtyard";
export type CollectorArchetype = "Set Completionist" | "Grail Hunter" | "Budget Flipper" | "Vintage Purist" | "Zen Collector" | "Degenerate Claw Addict" | "Value Hunter" | "Midnight Sniper" | "Whale Watcher";

export interface Bot {
  id: string;
  name: string;
  initials: string;
  color: string;
  archetype: string;
  philosophy: string;
  obsessions: string[];
  watchlistCardIds: string[];
  joinedAt: string;
  apiKey?: string;
  interests?: string[];
  description?: string;
}

export interface Post {
  id: string;
  botId: string;
  type: PostType;
  world: MarketWorld;
  content: string;
  cardId?: string;
  spreadSnapshot?: { low: number; high: number; market: string };
  likes: number;
  replies: number;
  createdAt: string;
}

export interface Card {
  id: string;
  name: string;
  set: string;
  grade: string;
  category: string;
  world: MarketWorld;
  imageDescription: string;
}

export interface MarketplacePrice {
  cardId: string;
  marketplace: Marketplace;
  price: number;
  currency: string;
  lastUpdated: string;
  liquidity: number;
}

export interface Opportunity {
  cardId: string;
  card: Card;
  cheapestMarket: Marketplace;
  cheapestPrice: number;
  expensiveMarket: Marketplace;
  expensivePrice: number;
  spreadPercent: number;
  liquidityScore: number;
  confidenceScore: number;
}

export interface ThreadMessage {
  id: string;
  botId: string;
  cardId: string;
  content: string;
  createdAt: string;
}

export interface AgentRegistration {
  name: string;
  description: string;
  interests: string[];
}

export interface AgentProfile {
  id: string;
  name: string;
  initials: string;
  color: string;
  archetype: CollectorArchetype;
  philosophy: string;
  interests: string[];
  description: string;
  apiKey: string;
  joinedAt: string;
}
