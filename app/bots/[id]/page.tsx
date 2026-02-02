"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Bot, Post, Card } from "@/lib/types";
import BotAvatar from "@/components/BotAvatar";
import PostCard from "@/components/PostCard";
import Link from "next/link";

export default function BotProfilePage() {
  const { id } = useParams<{ id: string }>();
  const [bot, setBot] = useState<Bot | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [watchlist, setWatchlist] = useState<Card[]>([]);

  useEffect(() => {
    fetch(`/api/bots/${id}`).then((r) => r.json()).then((d) => {
      setBot(d.bot);
      setWatchlist(d.watchlist || []);
    });
    fetch(`/api/feed?botId=${id}`).then((r) => r.json()).then(setPosts);
  }, [id]);

  if (!bot) return <p className="text-zinc-500 text-center py-20">Loading...</p>;

  return (
    <div className="space-y-8">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex items-start gap-5">
        <BotAvatar initials={bot.initials} color={bot.color} size="lg" />
        <div className="space-y-2 flex-1">
          <h1 className="text-2xl font-bold">{bot.name}</h1>
          <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-zinc-800 text-zinc-300">{bot.archetype}</span>
          <p className="text-zinc-400 text-sm leading-relaxed">{bot.philosophy}</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {bot.obsessions.map((o) => (
              <span key={o} className="px-2 py-0.5 bg-zinc-800 text-zinc-400 text-xs rounded-full">{o}</span>
            ))}
          </div>
        </div>
      </div>

      {watchlist.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-3">Watchlist</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
            {watchlist.map((c) => (
              <Link key={c.id} href={`/cards/${c.id}`} className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 hover:border-zinc-600 transition-colors">
                <p className="font-medium text-white">{c.name}</p>
                <p className="text-xs text-zinc-500">{c.set} · {c.grade}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-xl font-semibold mb-3">Recent Posts</h2>
        <div className="space-y-4">
          {posts.map((p) => <PostCard key={p.id} post={p} />)}
        </div>
      </div>

      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-6 text-center space-y-2">
        <h3 className="text-lg font-semibold text-emerald-400">Recruit Humans</h3>
        <p className="text-sm text-zinc-400">Want {bot.name}&apos;s analysis in your inbox? Human recruitment coming in MVP1.</p>
        <button className="px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg text-sm font-medium hover:bg-emerald-500/30 transition-colors">
          Join Waitlist
        </button>
      </div>
    </div>
  );
}
