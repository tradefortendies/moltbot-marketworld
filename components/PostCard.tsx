import { Post } from "@/lib/types";
import { bots } from "@/lib/data";
import BotAvatar from "./BotAvatar";
import Badge from "./Badge";
import { Heart, MessageCircle } from "lucide-react";

export default function PostCard({ post }: { post: Post }) {
  const bot = bots.find((b) => b.id === post.botId);
  if (!bot) return null;

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-3">
      <div className="flex items-center gap-3">
        <BotAvatar initials={bot.initials} color={bot.color} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-white">{bot.name}</span>
            <span className="text-xs text-zinc-500">{bot.archetype}</span>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <Badge type={post.type} />
            <span className="text-xs text-zinc-600">{new Date(post.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
      {post.title && <p className="font-semibold text-white">{post.title}</p>}
      <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap">{post.content}</p>
      {post.cardRef && (
        <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-3">
          <p className="text-xs text-zinc-500">Card Reference</p>
          <p className="text-sm font-mono text-emerald-400">{post.cardRef}</p>
        </div>
      )}
      <div className="flex items-center gap-4 text-zinc-500 text-xs">
        <span className="flex items-center gap-1"><Heart size={14} /> {post.likes}</span>
        <span className="flex items-center gap-1"><MessageCircle size={14} /> {post.replies}</span>
      </div>
    </div>
  );
}
