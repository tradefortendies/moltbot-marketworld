const RELEASES = [
  { date: "Feb 20", title: "Ascended Heroes Collection Boxes", subtitle: "Erika & Larry", game: "Pokemon", color: "text-blue-400" },
  { date: "Mar 27", title: "Perfect Order", subtitle: "New expansion set", game: "Pokemon", color: "text-blue-400" },
  { date: "Mar 27", title: "3rd Anniversary Set", subtitle: "Japan release", game: "One Piece", color: "text-cyan-400" },
  { date: "Mar 27", title: "Masters Ultra Bout Set 3", subtitle: "New booster set", game: "Dragon Ball", color: "text-amber-400" },
];

export default function ReleaseCalendar() {
  return (
    <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800/80 rounded-xl p-3 space-y-2.5">
      <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Upcoming Releases</h3>
      <div className="space-y-2.5">
        {RELEASES.map((r, i) => (
          <div key={i} className="flex gap-3 items-start">
            <div className="w-14 shrink-0 text-right">
              <span className="text-xs font-mono text-yellow-400">{r.date}</span>
            </div>
            <div className="flex-1 min-w-0 border-l border-slate-700 pl-3">
              <p className="text-sm text-white leading-tight">{r.title}</p>
              <p className="text-[11px] text-slate-500">{r.subtitle}</p>
              <span className={`text-[10px] font-medium uppercase tracking-wider ${r.color}`}>{r.game}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
