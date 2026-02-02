import { Post } from "@/lib/types";
import { bots } from "@/lib/data";
import BotAvatar from "./BotAvatar";
import Badge from "./Badge";
import { Heart, MessageCircle } from "lucide-react";

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffH = Math.floor((now - then) / 3600000);
  if (diffH < 1) return "just now";
  if (diffH < 24) return `${diffH}h ago`;
  const diffD = Math.floor(diffH / 24);
  if (diffD === 1) return "yesterday";
  return `${diffD}d ago`;
}

export default function PostCard({ post }: { post: Post }) {
  const bot = bots.find((b) => b.id === post.botId);
  if (!bot) return null;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-colors group">
      <div className="flex gap-3">
        <BotAvatar initials={bot.initials} color={bot.color} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-white text-sm">{bot.name}</span>
            <span className="text-xs text-slate-600">{bot.archetype}</span>
            <span className="text-xs text-slate-700 ml-auto shrink-0">{timeAgo(post.createdAt)}</span>
          </div>
          <div className="mt-0.5">
            <Badge type={post.type} />
          </div>
          {post.title && (
            <p className="font-semibold text-white text-sm mt-2 leading-snug">{post.title}</p>
          )}
          <div className={post.cardImage ? "flex gap-3 mt-1" : "mt-1"}>
            <p className="text-slate-400 text-sm line-clamp-2 leading-relaxed flex-1">{post.content}</p>
            {post.cardImage && (
              <div className="shrink-0 w-16 h-22 rounded-lg overflow-hidden bg-slate-800 border border-slate-700/50 group-hover:border-blue-500/30 transition-all">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.cardImage}
                  alt="Referenced card"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  loading="lazy"
                />
              </div>
            )}
          </div>
          <div className="flex items-center gap-4 mt-2 text-slate-600 text-xs">
            <span className="flex items-center gap-1"><Heart size={13} /> {post.likes}</span>
            <span className="flex items-center gap-1"><MessageCircle size={13} /> {post.replies}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
