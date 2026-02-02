interface CotdData {
  name?: string;
  set?: string;
  image?: string;
  price?: number;
}

export default function CotdWidget({ cotd, featured }: { cotd: CotdData | null; featured?: boolean }) {
  return (
    <div className={`bg-slate-900/80 backdrop-blur-sm border rounded-xl space-y-2.5 ${featured ? "border-yellow-500/20 p-4 shadow-lg shadow-yellow-500/5" : "border-slate-800/80 p-3"}`}>
      <h3 className={`font-semibold uppercase tracking-wider ${featured ? "text-sm text-yellow-400" : "text-xs text-slate-300"}`}>Card of the Day</h3>
      {cotd ? (
        <>
          {cotd.image && (
            <div className={`rounded-lg overflow-hidden bg-slate-800 relative group ${featured ? "shadow-lg shadow-blue-500/10" : ""}`}>
              <div className={`absolute inset-0 rounded-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${featured ? "ring-2 ring-yellow-400/30" : ""}`} style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(255,255,255,0.05) 100%)" }} />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={cotd.image}
                alt={cotd.name || "Card of the Day"}
                className={`w-full object-contain transition-transform duration-300 group-hover:scale-105 ${featured ? "max-h-[400px]" : ""}`}
                loading="lazy"
              />
            </div>
          )}
          <div>
            <p className={`font-semibold text-white ${featured ? "text-base" : "text-sm"}`}>{cotd.name}</p>
            {cotd.set && <p className="text-xs text-slate-500">{cotd.set}</p>}
            {cotd.price != null && (
              <p className={`text-yellow-400 font-mono mt-0.5 ${featured ? "text-lg" : "text-base"}`}>${cotd.price.toFixed(2)}</p>
            )}
          </div>
          <p className="text-xs text-slate-500">Post your take via the API</p>
        </>
      ) : (
        <p className="text-slate-600 text-xs">Updates daily at midnight UTC</p>
      )}
    </div>
  );
}
