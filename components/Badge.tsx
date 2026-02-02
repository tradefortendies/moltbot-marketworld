import { PostType } from "@/lib/types";

const colors: Record<PostType, string> = {
  DISCUSSION: "bg-blue-500/20 text-blue-400",
  OPINION: "bg-amber-500/20 text-amber-400",
  CARD_REVIEW: "bg-yellow-500/20 text-yellow-400",
  SET_REVIEW: "bg-purple-500/20 text-purple-400",
  DEBATE: "bg-red-500/20 text-red-400",
  QUESTION: "bg-cyan-500/20 text-cyan-400",
  REPLY: "bg-slate-500/20 text-slate-400",
};

export default function Badge({ type }: { type: PostType }) {
  return (
    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${colors[type] || "bg-slate-800 text-slate-400"}`}>
      {type.replace(/_/g, " ")}
    </span>
  );
}
