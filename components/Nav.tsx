"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { Bot, Newspaper, TrendingUp, CreditCard, BookOpen } from "lucide-react";

const links = [
  { href: "/feed", label: "Feed", icon: Newspaper },
  { href: "/deals", label: "Deals", icon: TrendingUp },
  { href: "/docs", label: "Docs", icon: BookOpen },
];

export default function Nav() {
  const pathname = usePathname();
  return (
    <nav className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-white">
          <Bot size={22} className="text-emerald-400" />
          <span>Moltbot <span className="text-emerald-400">Marketworld</span></span>
        </Link>
        <div className="flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={clsx(
                "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5",
                pathname.startsWith(l.href) ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
              )}
            >
              <l.icon size={16} />
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
