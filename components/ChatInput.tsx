"use client";

import { useRef, KeyboardEvent } from "react";
import { IconSend, IconStop } from "./Icons";
import { MODEL_DISPLAY_NAME } from "@/lib/types";

interface ChatInputProps {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  onStop: () => void;
  isStreaming: boolean;
}

export default function ChatInput({
  value,
  onChange,
  onSend,
  onStop,
  isStreaming,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInput = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 200) + "px";
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !isStreaming) {
        onSend();
        if (textareaRef.current) textareaRef.current.style.height = "auto";
      }
    }
  };

  return (
    <div
      className="shrink-0 border-t px-3 pb-3 pt-2 md:pb-5"
      style={{ borderColor: "var(--border-color)", backgroundColor: "var(--bg-main)" }}
    >
      <div className="max-w-3xl mx-auto">
        <div
          className="flex items-end gap-2 rounded-2xl border px-3 py-2 shadow-sm transition-shadow focus-within:shadow-md"
          style={{ borderColor: "var(--border-color)", backgroundColor: "var(--bg-main)" }}
        >
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              handleInput();
            }}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder={`Kirim pesan ke ${MODEL_DISPLAY_NAME}...`}
            className="flex-1 resize-none bg-transparent outline-none text-sm py-1.5 max-h-[200px] leading-6"
            style={{ color: "var(--text-primary)" }}
          />

          {isStreaming ? (
            <button
              onClick={onStop}
              className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-opacity hover:opacity-80"
              style={{ backgroundColor: "var(--text-primary)", color: "var(--bg-main)" }}
              aria-label="Hentikan"
            >
              <IconStop className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={onSend}
              disabled={!value.trim()}
              className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-opacity disabled:opacity-30 hover:opacity-80"
              style={{ backgroundColor: "var(--text-primary)", color: "var(--bg-main)" }}
              aria-label="Kirim"
            >
              <IconSend className="w-3.5 h-3.5 translate-x-[-1px]" />
            </button>
          )}
        </div>
        <p
          className="text-center text-[11px] mt-2 px-2"
          style={{ color: "var(--text-secondary)" }}
        >
          {MODEL_DISPLAY_NAME} dapat membuat kesalahan. Periksa kembali info penting.
        </p>
      </div>
    </div>
  );
}
