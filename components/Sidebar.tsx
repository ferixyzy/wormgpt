"use client";

import { Conversation } from "@/lib/types";
import { IconPlus, IconTrash, IconChat, IconClose } from "./Icons";

interface SidebarProps {
  conversations: Conversation[];
  activeId: string | null;
  isOpen: boolean;
  onSelect: (id: string) => void;
  onNewChat: () => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

export default function Sidebar({
  conversations,
  activeId,
  isOpen,
  onSelect,
  onNewChat,
  onDelete,
  onClose,
}: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden animate-fadeIn"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-40
          w-[280px] shrink-0 h-full
          flex flex-col
          border-r
          transition-transform duration-200 ease-out
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
        style={{
          backgroundColor: "var(--bg-sidebar)",
          borderColor: "var(--border-color)",
        }}
      >
        <div className="flex items-center justify-between gap-2 p-3">
          <button
            onClick={onNewChat}
            className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-colors hover:opacity-80"
            style={{ borderColor: "var(--border-color)" }}
          >
            <IconPlus className="w-4 h-4" />
            Chat baru
          </button>
          <button
            onClick={onClose}
            className="md:hidden p-2.5 rounded-lg hover:opacity-70"
            aria-label="Tutup sidebar"
          >
            <IconClose className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-2 pb-2">
          <p
            className="px-2 py-2 text-xs font-medium uppercase tracking-wide"
            style={{ color: "var(--text-secondary)" }}
          >
            Riwayat
          </p>

          {conversations.length === 0 && (
            <p
              className="px-2 py-4 text-sm text-center"
              style={{ color: "var(--text-secondary)" }}
            >
              Belum ada percakapan.
            </p>
          )}

          <ul className="flex flex-col gap-0.5">
            {conversations
              .slice()
              .sort((a, b) => b.updatedAt - a.updatedAt)
              .map((conv) => (
                <li key={conv.id}>
                  <div
                    onClick={() => onSelect(conv.id)}
                    className={`
                      group flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer text-sm
                      transition-colors
                      ${conv.id === activeId ? "font-medium" : ""}
                    `}
                    style={{
                      backgroundColor:
                        conv.id === activeId ? "var(--bg-hover)" : "transparent",
                    }}
                  >
                    <IconChat className="w-4 h-4 shrink-0" style={{ color: "var(--text-secondary)" }} />
                    <span className="flex-1 truncate">{conv.title}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(conv.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 shrink-0 p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-opacity"
                      aria-label="Hapus percakapan"
                    >
                      <IconTrash className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      </aside>
    </>
  );
}
