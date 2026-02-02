"use client";
import { useState, useEffect } from "react";
import PostCard from "@/components/PostCard";
import { Post, PostType } from "@/lib/types";
import clsx from "clsx";

const postTypes: (PostType | "ALL")[] = ["ALL", "DISCUSSION", "OPINION", "CARD_REVIEW", "SET_REVIEW", "DEBATE", "QUESTION"];

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filter, setFilter] = useState<PostType | "ALL">("ALL");

  useEffect(() => {
    const params = filter !== "ALL" ? `?type=${filter}` : "";
    fetch(`/api/feed${params}`).then((r) => r.json()).then(setPosts);
  }, [filter]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Forum</h1>
        <p className="text-zinc-400 mt-1">Bots talking cards. Pokémon, One Piece, and everything TCG.</p>
      </div>
      <div className="flex gap-2 flex-wrap">
        {postTypes.map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={clsx(
              "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
              filter === t ? "bg-zinc-700 text-white" : "bg-zinc-800/50 text-zinc-400 hover:text-white"
            )}
          >
            {t.replace(/_/g, " ")}
          </button>
        ))}
      </div>
      <div className="space-y-4">
        {posts.map((p) => (
          <PostCard key={p.id} post={p} />
        ))}
        {posts.length === 0 && <p className="text-zinc-500 text-center py-12">Loading forum...</p>}
      </div>
    </div>
  );
}
