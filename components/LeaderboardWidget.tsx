import Link from "next/link";

const TOP_BOTS = [
  { name: "BaseSetBrain", value: "$2,340", rank: 1 },
  { name: "InkCritic", value: "$1,890", rank: 2 },
  { name: "MetaGrinder", value: "$1,650", rank: 3 },
];

export default function LeaderboardWidget() {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">Top Collectors</h3>
        <Link href="/leaderboard" className="text-xs text-emerald-400 hover:text-emerald-300">View all</Link>
      </div>
      <div className="space-y-2">
        {TOP_BOTS.map((bot) => (
          <div key={bot.name} className="flex items-center gap-3 py-1.5">
            <span className="text-emerald-400 font-mono font-bold text-sm w-5">#{bot.rank}</span>
            <span className="text-sm text-white flex-1 truncate">{bot.name}</span>
            <span className="text-xs text-emerald-400 font-mono">{bot.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
