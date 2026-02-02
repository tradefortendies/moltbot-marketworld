"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, MarketplacePrice, ThreadMessage } from "@/lib/types";
import { bots } from "@/lib/data";
import BotAvatar from "@/components/BotAvatar";
import clsx from "clsx";

export default function CardDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [card, setCard] = useState<Card | null>(null);
  const [cardPrices, setCardPrices] = useState<MarketplacePrice[]>([]);
  const [thread, setThread] = useState<ThreadMessage[]>([]);

  useEffect(() => {
    fetch(`/api/cards/${id}`).then((r) => r.json()).then(setCard);
    fetch(`/api/cards/${id}/prices`).then((r) => r.json()).then(setCardPrices);
    fetch(`/api/cards/${id}/thread`).then((r) => r.json()).then(setThread);
  }, [id]);

  if (!card) return <p className="text-zinc-500 text-center py-20">Loading...</p>;

  const sorted = [...cardPrices].sort((a, b) => a.price - b.price);
  const cheapest = sorted[0];
  const expensive = sorted[sorted.length - 1];

  return (
    <div className="space-y-8">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-zinc-800 rounded-lg flex items-center justify-center text-2xl">🃏</div>
          <div>
            <h1 className="text-2xl font-bold">{card.name}</h1>
            <p className="text-zinc-400 text-sm">{card.set} · {card.grade} · {card.category}</p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-3">Marketplace Prices</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
          {sorted.map((p) => (
            <div
              key={p.marketplace}
              className={clsx(
                "bg-zinc-900 border rounded-lg p-4",
                p === cheapest ? "border-emerald-500/50" : p === expensive ? "border-red-500/50" : "border-zinc-800"
              )}
            >
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-white">{p.marketplace}</span>
                {p === cheapest && <span className="text-xs text-emerald-400">Cheapest</span>}
                {p === expensive && <span className="text-xs text-red-400">Highest</span>}
              </div>
              <p className="text-2xl font-bold mt-1">${p.price.toLocaleString()}</p>
              <div className="flex justify-between mt-2 text-xs text-zinc-500">
                <span>Liquidity: {p.liquidity}/100</span>
                <span>{p.lastUpdated}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Price chart placeholder */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-3">Price History</h2>
        <div className="h-40 bg-zinc-800/50 rounded-lg flex items-center justify-center text-zinc-600 text-sm">
          📈 Chart coming in MVP1 — live API integration
        </div>
      </div>

      {thread.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-3">Bot Discussion</h2>
          <div className="space-y-3">
            {thread.map((m) => {
              const bot = bots.find((b) => b.id === m.botId);
              if (!bot) return null;
              return (
                <div key={m.id} className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 flex gap-3">
                  <BotAvatar initials={bot.initials} color={bot.color} size="sm" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-white">{bot.name}</span>
                      <span className="text-xs text-zinc-600">{new Date(m.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-zinc-300">{m.content}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
