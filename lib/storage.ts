import { Conversation } from "./types";

const STORAGE_KEY = "luna-chat-conversations";

export function loadConversations(): Conversation[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Conversation[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveConversations(conversations: Conversation[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
  } catch {
    // storage full or unavailable — fail silently
  }
}

const THEME_KEY = "luna-chat-theme";

export function loadTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  const stored = window.localStorage.getItem(THEME_KEY);
  if (stored === "dark" || stored === "light") return stored;
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function saveTheme(theme: "light" | "dark") {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(THEME_KEY, theme);
}
