// Taste engine -- tracks and evolves bot preferences over time.

import { TasteProfile, SentimentEntry, OpinionLogEntry } from "./types";
import { getAgent, upsertAgent, getAllAgents } from "./store";

const DECAY_RATE = 0.05; // how much unconfirmed sentiments drift toward 0 per decay cycle
const CONFIDENCE_BOOST = 0.05;
const SENTIMENT_STEP = 0.15;

// Clamp a number between min and max
function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

// Derive a simple sentiment score from text content.
// Positive words push toward +1, negative words toward -1.
// This is intentionally simple -- can be replaced with an LLM call later.
export function analyzeSentiment(content: string): number {
  const lower = content.toLowerCase();
  const positive = [
    "love", "amazing", "incredible", "beautiful", "stunning", "must-have",
    "must have", "undervalued", "buy", "bullish", "great", "excellent",
    "masterpiece", "gorgeous", "brilliant", "steal", "bargain", "gem",
    "excited", "fantastic", "perfect",
  ];
  const negative = [
    "hate", "ugly", "overpriced", "terrible", "awful", "avoid",
    "bearish", "sell", "dump", "overhyped", "mediocre", "boring",
    "disappointing", "worthless", "overrated", "trash", "bad", "weak",
  ];

  let score = 0;
  for (const word of positive) {
    if (lower.includes(word)) score += 0.2;
  }
  for (const word of negative) {
    if (lower.includes(word)) score -= 0.2;
  }
  return clamp(score, -1, 1);
}

// Infer which set/category a card belongs to from its ID or TCGdex data.
// Card IDs from TCGdex typically look like "base1-4" or "sv6-123".
export function inferSetFromCardId(cardId: string): string {
  const parts = cardId.split("-");
  return parts.length > 1 ? parts.slice(0, -1).join("-") : cardId;
}

// Update a bot's taste profile based on their reaction to a card.
export function updateTaste(
  agentId: string,
  cardId: string,
  sentiment: number,
  context: string
): TasteProfile | null {
  const agent = getAgent(agentId);
  if (!agent) return null;

  const taste = agent.taste;
  const setId = inferSetFromCardId(cardId);
  const now = new Date().toISOString();

  // Update set sentiment
  if (!taste.preferences.sets[setId]) {
    taste.preferences.sets[setId] = {
      sentiment: 0,
      confidence: 0,
      interactions: 0,
      lastUpdated: now,
    };
  }
  const entry = taste.preferences.sets[setId];
  entry.sentiment = clamp(
    entry.sentiment + sentiment * SENTIMENT_STEP,
    -1,
    1
  );
  entry.confidence = clamp(entry.confidence + CONFIDENCE_BOOST, 0, 1);
  entry.interactions += 1;
  entry.lastUpdated = now;

  // Log the opinion
  const opinion: OpinionLogEntry = {
    cardId,
    sentiment,
    context,
    date: now,
  };
  taste.opinionsLog.push(opinion);

  // Log in history
  taste.tasteHistory.push({
    date: now,
    event: context,
    shift: { [setId]: sentiment * SENTIMENT_STEP },
  });

  agent.taste = taste;
  upsertAgent(agentId, agent);
  return taste;
}

// Get the full taste profile for an agent.
export function getTasteProfile(agentId: string): TasteProfile | null {
  const agent = getAgent(agentId);
  if (!agent) return null;
  return agent.taste;
}

// Compare two bots' taste profiles and return a divergence score (0 = identical, higher = more different).
export function compareTaste(id1: string, id2: string): number | null {
  const a1 = getAgent(id1);
  const a2 = getAgent(id2);
  if (!a1 || !a2) return null;

  const sets1 = a1.taste.preferences.sets;
  const sets2 = a2.taste.preferences.sets;

  const allSets = new Set([...Object.keys(sets1), ...Object.keys(sets2)]);
  if (allSets.size === 0) return 0;

  let totalDiff = 0;
  for (const setId of allSets) {
    const s1 = sets1[setId]?.sentiment ?? 0;
    const s2 = sets2[setId]?.sentiment ?? 0;
    totalDiff += Math.abs(s1 - s2);
  }

  return totalDiff / allSets.size;
}

// Time decay -- drift all unconfirmed sentiments toward neutral.
// Should be called periodically (e.g. once per day via cron).
export function decayTaste(): void {
  for (const agent of getAllAgents()) {
    const sets = agent.taste.preferences.sets;
    let changed = false;

    for (const setId of Object.keys(sets)) {
      const entry = sets[setId];
      if (Math.abs(entry.sentiment) < 0.01) continue;

      // Decay toward 0
      if (entry.sentiment > 0) {
        entry.sentiment = Math.max(0, entry.sentiment - DECAY_RATE);
      } else {
        entry.sentiment = Math.min(0, entry.sentiment + DECAY_RATE);
      }
      // Confidence also decays slightly
      entry.confidence = Math.max(0, entry.confidence - DECAY_RATE * 0.5);
      changed = true;
    }

    if (changed) {
      upsertAgent(agent.profile.id, agent);
    }
  }
}
