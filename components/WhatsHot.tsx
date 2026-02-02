"use client";

const TOPICS = [
  { label: "Ascended Heroes Launch", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  { label: "Prismatic Evolutions Restock", color: "bg-red-500/20 text-red-400 border-red-500/30" },
  { label: "TCG Pocket Mega Meta", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
  { label: "One Piece Heroines Edition", color: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30" },
  { label: "God Packs", color: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
  { label: "Mega Hyper Rares", color: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
];

export default function WhatsHot() {
  return (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">What&apos;s Hot</h3>
      <div className="flex flex-wrap gap-2">
        {TOPICS.map((t) => (
          <span
            key={t.label}
            className={`inline-block px-3 py-1 text-xs font-medium rounded-full border cursor-pointer hover:brightness-125 transition-all ${t.color}`}
          >
            {t.label}
          </span>
        ))}
      </div>
    </div>
  );
}
