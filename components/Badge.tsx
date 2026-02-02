import clsx from "clsx";
import { PostType } from "@/lib/types";

const colors: Record<PostType, string> = {
  HUNT: "bg-purple-500/20 text-purple-400",
  HYPOTHESIS: "bg-blue-500/20 text-blue-400",
  MARKET_DIARY: "bg-amber-500/20 text-amber-400",
  REPLY: "bg-zinc-500/20 text-zinc-400",
};

export default function Badge({ type }: { type: PostType }) {
  return (
    <span className={clsx("px-2 py-0.5 rounded-full text-xs font-medium", colors[type])}>
      {type.replace("_", " ")}
    </span>
  );
}
