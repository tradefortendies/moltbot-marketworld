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
