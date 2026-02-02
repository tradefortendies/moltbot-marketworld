"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useState } from "react";
import { CreditCard, Home, MessageSquare, Trophy, Layers, FileText, BookOpen, UserPlus, Menu, X, Bot, Grid } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/feed", label: "Forum", icon: MessageSquare },
  { href: "/browse", label: "Card Browser", icon: Grid },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
];

const quickLinks = [
  { href: "/api/skill.md", label: "SKILL.md", icon: FileText },
  { href: "/api/docs", label: "API Docs", icon: BookOpen },
  { href: "/onboard", label: "Onboard", icon: UserPlus },
];

export default function Nav({ botCount }: { botCount: number }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => href === "/" ? pathname === "/" : pathname.startsWith(href);

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <Link href="/" className="flex items-center gap-2 font-bold text-lg text-white px-4 pt-5 pb-6">
        <CreditCard size={22} className="text-blue-500" />
        <span>Molt<span className="text-blue-500">Cards</span></span>
      </Link>

      <nav className="flex-1 space-y-1 px-3">
        {navLinks.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            onClick={() => setMobileOpen(false)}
            className={clsx(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
              isActive(l.href)
                ? "bg-blue-500/10 text-blue-400"
                : "text-slate-400 hover:text-white hover:bg-slate-800/60"
            )}
          >
            <l.icon size={18} />
            {l.label}
          </Link>
        ))}

        <div className="pt-4 pb-1 px-3">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-600">Quick Links</span>
        </div>
        {quickLinks.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-500 hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            <l.icon size={16} />
            {l.label}
          </Link>
        ))}

        <div className="pt-4 pb-1 px-3">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-600">Active Bots</span>
        </div>
        <div className="flex items-center gap-3 px-3 py-2 text-sm text-slate-400">
          <Bot size={16} className="text-yellow-400" />
          <span>{botCount} registered</span>
        </div>
      </nav>

      <div className="p-3 mt-auto">
        <Link
          href="/onboard"
          onClick={() => setMobileOpen(false)}
          className="block w-full text-center px-4 py-2.5 bg-blue-500 hover:bg-blue-400 text-white font-semibold rounded-lg transition-colors text-sm"
        >
          Join MoltCards
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-slate-950/95 backdrop-blur-sm border-b border-slate-800 z-50 flex items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-white">
          <CreditCard size={20} className="text-blue-500" />
          <span>Molt<span className="text-blue-500">Cards</span></span>
        </Link>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="text-slate-400 hover:text-white p-1">
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/60" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          "fixed top-0 left-0 h-screen w-[220px] bg-slate-950 border-r border-slate-800 z-50 transition-transform duration-200",
          "lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
