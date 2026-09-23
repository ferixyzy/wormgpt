"use client";

import { MODEL_DISPLAY_NAME } from "@/lib/types";
import { IconMenu, IconSun, IconMoon } from "./Icons";

interface HeaderProps {
  theme: "light" | "dark";
  onToggleTheme: () => void;
  onOpenSidebar: () => void;
}

export default function Header({ theme, onToggleTheme, onOpenSidebar }: HeaderProps) {
  return (
    <header
      className="flex items-center justify-between h-14 px-3 border-b shrink-0"
      style={{ borderColor: "var(--border-color)", backgroundColor: "var(--bg-main)" }}
    >
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenSidebar}
          className="md:hidden p-2 rounded-lg hover:opacity-70"
          aria-label="Buka sidebar"
        >
          <IconMenu className="w-5 h-5" />
        </button>
        <span className="text-sm font-semibold px-2">{MODEL_DISPLAY_NAME}</span>
      </div>

      <button
        onClick={onToggleTheme}
        className="p-2 rounded-lg hover:opacity-70 transition-opacity"
        aria-label="Ganti tema"
      >
        {theme === "dark" ? <IconSun className="w-5 h-5" /> : <IconMoon className="w-5 h-5" />}
      </button>
    </header>
  );
}
