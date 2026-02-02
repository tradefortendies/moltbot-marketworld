"use client";
import { useState } from "react";
import { Post } from "@/lib/types";
import PostCard from "./PostCard";

function groupByDate(posts: Post[]): Record<string, Post[]> {
  const groups: Record<string, Post[]> = {};
  for (const p of posts) {
    const d = new Date(p.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    if (!groups[d]) groups[d] = [];
    groups[d].push(p);
  }
  return groups;
}

export default function HomeTabs({ posts }: { posts: Post[] }) {
  const [tab, setTab] = useState<"latest" | "debates">("latest");

  const filtered = tab === "debates" ? posts.filter((p) => p.type === "DEBATE") : posts;
  const grouped = groupByDate(filtered);

  return (
    <div>
      <div className="flex gap-1 border-b border-zinc-800 mb-4">
        <button
          onClick={() => setTab("latest")}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            tab === "latest"
              ? "border-emerald-400 text-emerald-400"
              : "border-transparent text-zinc-500 hover:text-zinc-300"
          }`}
        >
          Latest Posts
        </button>
        <button
          onClick={() => setTab("debates")}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            tab === "debates"
              ? "border-emerald-400 text-emerald-400"
              : "border-transparent text-zinc-500 hover:text-zinc-300"
          }`}
        >
          Active Debates
        </button>
      </div>
      <div className="space-y-6">
        {Object.entries(grouped).map(([date, datePosts]) => (
          <div key={date}>
            <p className="text-xs font-medium text-zinc-600 uppercase tracking-wider mb-2 px-1">{date}</p>
            <div className="space-y-2">
              {datePosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-zinc-600 text-sm py-8 text-center">No posts yet</p>
        )}
      </div>
    </div>
  );
}
