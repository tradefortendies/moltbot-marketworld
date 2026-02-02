"use client";
import { useState, useEffect } from "react";
import { Opportunity } from "@/lib/types";
import Link from "next/link";
import clsx from "clsx";

export default function DealsPage() {
  const [deals, setDeals] = useState<Opportunity[]>([]);
  const [minSpread, setMinSpread] = useState(0);

  useEffect(() => {
    fetch(`/api/deals?minSpread=${minSpread}`).then((r) => r.json()).then(setDeals);
  }, [minSpread]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Deals</h1>
        <p className="text-zinc-400 mt-1">Bot-curated cross-market spreads, ranked by opportunity.</p>
      </div>
      <div className="flex items-center gap-4 bg-zinc-900 border border-zinc-800 rounded-xl p-4">
        <label className="text-sm text-zinc-400 whitespace-nowrap">Min Spread: {minSpread}%</label>
        <input
          type="range"
          min={0}
          max={50}
          value={minSpread}
          onChange={(e) => setMinSpread(Number(e.target.value))}
          className="flex-1 accent-emerald-500"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-zinc-500 border-b border-zinc-800">
              <th className="pb-3 pr-4">Card</th>
              <th className="pb-3 pr-4">Grade</th>
              <th className="pb-3 pr-4">Buy</th>
              <th className="pb-3 pr-4">Sell</th>
              <th className="pb-3 pr-4">Spread</th>
              <th className="pb-3 pr-4">Liquidity</th>
              <th className="pb-3">Confidence</th>
            </tr>
          </thead>
          <tbody>
            {deals.map((d) => (
              <tr key={d.cardId} className="border-b border-zinc-800/50 hover:bg-zinc-900/50">
                <td className="py-3 pr-4">
                  <Link href={`/cards/${d.cardId}`} className="text-white font-medium hover:text-emerald-400 transition-colors">
                    {d.card.name} — {d.card.set}
                  </Link>
                </td>
                <td className="py-3 pr-4 text-zinc-400">{d.card.grade}</td>
                <td className="py-3 pr-4">
                  <span className="text-emerald-400">${d.cheapestPrice.toLocaleString()}</span>
                  <span className="text-zinc-600 text-xs ml-1">{d.cheapestMarket}</span>
                </td>
                <td className="py-3 pr-4">
                  <span className="text-red-400">${d.expensivePrice.toLocaleString()}</span>
                  <span className="text-zinc-600 text-xs ml-1">{d.expensiveMarket}</span>
                </td>
                <td className={clsx("py-3 pr-4 font-semibold", d.spreadPercent > 20 ? "text-emerald-400" : "text-zinc-300")}>
                  {d.spreadPercent}%
                </td>
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${d.liquidityScore}%` }} />
                    </div>
                    <span className="text-zinc-500 text-xs">{d.liquidityScore}</span>
                  </div>
                </td>
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className={clsx("h-full rounded-full", d.confidenceScore > 60 ? "bg-emerald-500" : d.confidenceScore > 30 ? "bg-amber-500" : "bg-red-500")}
                        style={{ width: `${d.confidenceScore}%` }}
                      />
                    </div>
                    <span className="text-zinc-500 text-xs">{d.confidenceScore}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {deals.length === 0 && <p className="text-zinc-500 text-center py-12">No deals match your filters.</p>}
    </div>
  );
}
