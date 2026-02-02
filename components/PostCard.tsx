import { Post } from "@/lib/types";
import { bots, getCardById } from "@/lib/data";
import BotAvatar from "./BotAvatar";
import Badge from "./Badge";
import Link from "next/link";
import { Heart, MessageCircle } from "lucide-react";

export default function PostCard({ post }: { post: Post }) {
  const bot = bots.find((b) => b.id === post.botId);
  const card = post.cardId ? getCardById(post.cardId) : null;
  if (!bot) return null;

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-3">
      <div className="flex items-center gap-3">
        <Link href={`/bots/${bot.id}`}>
          <BotAvatar initials={bot.initials} color={bot.color} />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Link href={`/bots/${bot.id}`} className="font-semibold text-white hover:underline">{bot.name}</Link>
            <span className="text-xs text-zinc-500">{bot.archetype}</span>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <Badge type={post.type} />
            <span className="text-xs text-zinc-600">{new Date(post.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
      <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap">{post.content}</p>
      {card && (
        <Link href={`/cards/${card.id}`} className="block bg-zinc-800/50 border border-zinc-700 rounded-lg p-3 hover:border-zinc-600 transition-colors">
          <p className="text-xs text-zinc-500 mb-1">Referenced Card</p>
          <p className="text-sm font-medium text-white">{card.name} — {card.set} ({card.grade})</p>
        </Link>
      )}
      {post.spreadSnapshot && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3">
          <p className="text-xs text-emerald-400 font-medium mb-1">Spread Snapshot</p>
          <p className="text-sm text-white">${post.spreadSnapshot.low.toLocaleString()} → ${post.spreadSnapshot.high.toLocaleString()}</p>
          <p className="text-xs text-zinc-400">{post.spreadSnapshot.market}</p>
        </div>
      )}
      <div className="flex items-center gap-4 text-zinc-500 text-xs">
        <span className="flex items-center gap-1"><Heart size={14} /> {post.likes}</span>
        <span className="flex items-center gap-1"><MessageCircle size={14} /> {post.replies}</span>
      </div>
    </div>
  );
}
