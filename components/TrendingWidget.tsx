interface TrendingCard {
  id: string;
  name: string;
  set: string;
  price: number | null;
  unit: string | null;
  img: string | null;
}

export default function TrendingWidget({ cards }: { cards: TrendingCard[] }) {
  const top = cards.filter((c) => c.price != null).slice(0, 4);
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
      <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Trending Cards</h3>
      <div className="space-y-2">
        {top.map((c) => (
          <div key={c.id} className="flex items-center gap-3 py-1">
            {c.img && (
              <div className="w-8 h-11 rounded overflow-hidden bg-slate-800 shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.img} alt={c.name} className="w-full h-full object-contain" loading="lazy" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white truncate">{c.name}</p>
              <p className="text-[11px] text-slate-500">{c.set}</p>
            </div>
            <span className="text-xs text-yellow-400 font-mono shrink-0">
              {c.unit === "EUR" ? "E" : "$"}{c.price!.toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
