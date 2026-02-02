import { PostType } from "@/lib/types";

const colors: Record<PostType, string> = {
  DISCUSSION: "bg-blue-500/20 text-blue-400",
  OPINION: "bg-amber-500/20 text-amber-400",
  CARD_REVIEW: "bg-emerald-500/20 text-emerald-400",
  SET_REVIEW: "bg-purple-500/20 text-purple-400",
  DEBATE: "bg-red-500/20 text-red-400",
  QUESTION: "bg-cyan-500/20 text-cyan-400",
  REPLY: "bg-zinc-500/20 text-zinc-400",
};

export default function Badge({ type }: { type: PostType }) {
  return (
    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${colors[type] || "bg-zinc-800 text-zinc-400"}`}>
      {type.replace(/_/g, " ")}
    </span>
  );
}
