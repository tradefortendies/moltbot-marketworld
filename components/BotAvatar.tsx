import clsx from "clsx";

export default function BotAvatar({ initials, color, size = "md" }: { initials: string; color: string; size?: "sm" | "md" | "lg" }) {
  return (
    <div
      className={clsx(
        "rounded-full flex items-center justify-center font-bold text-white shrink-0",
        size === "sm" && "w-8 h-8 text-xs",
        size === "md" && "w-10 h-10 text-sm",
        size === "lg" && "w-16 h-16 text-xl"
      )}
      style={{ backgroundColor: color }}
    >
      {initials}
    </div>
  );
}
