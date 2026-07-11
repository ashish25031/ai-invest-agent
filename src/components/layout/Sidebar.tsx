"use client";

import { LayoutDashboard, History, Bookmark, ArrowLeftRight, Settings, BarChart2 } from "lucide-react";

export function Sidebar() {
  return (
    <aside className="w-64 bg-zinc-950 border-r border-zinc-900 hidden md:flex flex-col h-screen sticky top-0">
      <div className="h-16 flex items-center px-6 border-b border-zinc-900/50">
        <div className="flex items-center gap-2 text-primary">
          <BarChart2 className="w-6 h-6" />
          <span className="font-heading font-semibold text-lg text-white">InvestAgent</span>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto py-6 px-4">
        <nav className="space-y-1">
          <SidebarItem icon={<LayoutDashboard size={18} />} label="Dashboard" active />
          <SidebarItem icon={<History size={18} />} label="Research History" />
          <SidebarItem icon={<Bookmark size={18} />} label="Watchlist" />
          <SidebarItem icon={<ArrowLeftRight size={18} />} label="Compare Companies" />
        </nav>
      </div>

      <div className="p-4 border-t border-zinc-900/50">
        <nav className="space-y-1">
          <SidebarItem icon={<Settings size={18} />} label="Settings" />
        </nav>
      </div>
    </aside>
  );
}

function SidebarItem({ icon, label, active = false }: { icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <button
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium
        ${active ? "bg-primary/10 text-primary" : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900"}`}
    >
      {icon}
      {label}
    </button>
  );
}
