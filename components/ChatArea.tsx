"use client";

import { useEffect, useRef } from "react";
import { ChatMessage, MODEL_DISPLAY_NAME } from "@/lib/types";
import Message from "./Message";
import TypingIndicator from "./TypingIndicator";

interface ChatAreaProps {
  messages: ChatMessage[];
  isThinking: boolean;
  onSuggestion: (text: string) => void;
}

const SUGGESTIONS = [
  "Jelaskan konsep ini secara sederhana",
  "Buatkan rencana belajar 7 hari",
  "Bantu perbaiki kode saya",
  "Ringkas dokumen panjang",
];

export default function ChatArea({ messages, isThinking, onSuggestion }: ChatAreaProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isThinking]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center px-4">
        <h1 className="text-2xl font-semibold mb-8">
          Ada yang bisa dibantu?
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => onSuggestion(s)}
              className="text-left text-sm px-4 py-3 rounded-xl border transition-colors hover:opacity-80"
              style={{ borderColor: "var(--border-color)" }}
            >
              {s}
            </button>
          ))}
        </div>
        <p className="text-xs mt-8" style={{ color: "var(--text-secondary)" }}>
          {MODEL_DISPLAY_NAME}
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {messages.map((m) => (
        <Message key={m.id} message={m} />
      ))}
      {isThinking && <TypingIndicator />}
      <div ref={bottomRef} className="h-4" />
    </div>
  );
}
