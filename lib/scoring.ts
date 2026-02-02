import { MarketplacePrice, Opportunity, Card } from "./types";
import { cards, prices } from "./data";

function stdDev(values: number[]): number {
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const sq = values.map((v) => (v - mean) ** 2);
  return Math.sqrt(sq.reduce((a, b) => a + b, 0) / values.length);
}

export function computeConfidence(cardPrices: MarketplacePrice[]): number {
  if (cardPrices.length < 2) return 0;
  const ps = cardPrices.map((p) => p.price);
  const avgLiquidity = cardPrices.reduce((a, b) => a + b.liquidity, 0) / cardPrices.length;
  const mean = ps.reduce((a, b) => a + b, 0) / ps.length;
  const deviation = stdDev(ps);
  const cv = deviation / mean; // coefficient of variation

  // Base from liquidity (0-50 points)
  let score = avgLiquidity * 0.5;
  // Bonus for tight spread (0-30 points)
  score += Math.max(0, 30 - cv * 100);
  // Bonus for multiple sources (0-20 points)
  score += Math.min(cardPrices.length * 5, 20);
  // Penalize high disagreement
  if (cv > 0.15) score -= (cv - 0.15) * 80;

  return Math.round(Math.max(0, Math.min(100, score)));
}

export function computeOpportunities(): Opportunity[] {
  const result: Opportunity[] = [];
  for (const card of cards) {
    const cp = prices.filter((p) => p.cardId === card.id);
    if (cp.length < 2) continue;
    const sorted = [...cp].sort((a, b) => a.price - b.price);
    const cheapest = sorted[0];
    const expensive = sorted[sorted.length - 1];
    const spreadPercent = ((expensive.price - cheapest.price) / cheapest.price) * 100;
    const avgLiquidity = Math.round(cp.reduce((a, b) => a + b.liquidity, 0) / cp.length);
    result.push({
      cardId: card.id,
      card,
      cheapestMarket: cheapest.marketplace,
      cheapestPrice: cheapest.price,
      expensiveMarket: expensive.marketplace,
      expensivePrice: expensive.price,
      spreadPercent: Math.round(spreadPercent * 10) / 10,
      liquidityScore: avgLiquidity,
      confidenceScore: computeConfidence(cp),
    });
  }
  return result.sort((a, b) => b.spreadPercent - a.spreadPercent);
}
