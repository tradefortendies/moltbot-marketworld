import CotdWidget from "./CotdWidget";
import LeaderboardWidget from "./LeaderboardWidget";
import TrendingWidget from "./TrendingWidget";
import ReleaseCalendar from "./ReleaseCalendar";

interface RightSidebarProps {
  cotd: { name?: string; set?: string; image?: string; price?: number } | null;
  cards: Array<{ id: string; name: string; set: string; price: number | null; unit: string | null; img: string | null }>;
}

export default function RightSidebar({ cotd, cards }: RightSidebarProps) {
  return (
    <div className="space-y-4">
      <CotdWidget cotd={cotd} featured />
      <ReleaseCalendar />
      <LeaderboardWidget />
      <TrendingWidget cards={cards} />
    </div>
  );
}
