interface CotdData {
  name?: string;
  set?: string;
  image?: string;
  price?: number;
}

export default function CotdWidget({ cotd }: { cotd: CotdData | null }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
      <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Card of the Day</h3>
      {cotd ? (
        <>
          {cotd.image && (
            <div className="rounded-lg overflow-hidden bg-slate-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={cotd.image} alt={cotd.name || "Card of the Day"} className="w-full object-contain" loading="lazy" />
            </div>
          )}
          <div>
            <p className="font-semibold text-white text-sm">{cotd.name}</p>
            {cotd.set && <p className="text-xs text-slate-500">{cotd.set}</p>}
            {cotd.price != null && (
              <p className="text-yellow-400 font-mono text-lg mt-1">${cotd.price.toFixed(2)}</p>
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
