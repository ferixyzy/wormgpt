"use client";

import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { ChatMessage, Conversation } from "@/lib/types";
import { loadConversations, saveConversations, loadTheme, saveTheme } from "@/lib/storage";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import ChatArea from "@/components/ChatArea";
import ChatInput from "@/components/ChatInput";

function titleFromMessage(text: string) {
  const clean = text.trim().replace(/\s+/g, " ");
  return clean.length > 40 ? clean.slice(0, 40) + "…" : clean || "Percakapan baru";
}

export default function Home() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [hydrated, setHydrated] = useState(false);

  const abortRef = useRef<AbortController | null>(null);

  // hydrate from localStorage on mount
  useEffect(() => {
    const convs = loadConversations();
    setConversations(convs);
    setActiveId(convs[0]?.id ?? null);
    setTheme(loadTheme());
    setHydrated(true);
  }, []);

  // persist conversations
  useEffect(() => {
    if (hydrated) saveConversations(conversations);
  }, [conversations, hydrated]);

  // apply theme class
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    if (hydrated) saveTheme(theme);
  }, [theme, hydrated]);

  const activeConversation = conversations.find((c) => c.id === activeId) || null;

  function handleNewChat() {
    setActiveId(null);
    setInput("");
    setSidebarOpen(false);
  }

  function handleSelect(id: string) {
    setActiveId(id);
    setSidebarOpen(false);
  }

  function handleDelete(id: string) {
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (activeId === id) setActiveId(null);
  }

  async function handleSend(overrideText?: string) {
    const text = (overrideText ?? input).trim();
    if (!text || isStreaming) return;

    setInput("");

    const userMsg: ChatMessage = {
      id: uuidv4(),
      role: "user",
      content: text,
      createdAt: Date.now(),
    };

    let convId = activeId;
    let workingConv: Conversation;

    if (!convId) {
      convId = uuidv4();
      workingConv = {
        id: convId,
        title: titleFromMessage(text),
        messages: [userMsg],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      setConversations((prev) => [workingConv, ...prev]);
      setActiveId(convId);
    } else {
      const existing = conversations.find((c) => c.id === convId)!;
      workingConv = {
        ...existing,
        messages: [...existing.messages, userMsg],
        updatedAt: Date.now(),
      };
      setConversations((prev) =>
        prev.map((c) => (c.id === convId ? workingConv : c))
      );
    }

    const assistantId = uuidv4();
    const assistantMsg: ChatMessage = {
      id: assistantId,
      role: "assistant",
      content: "",
      createdAt: Date.now(),
    };

    setIsThinking(true);
    setIsStreaming(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const apiMessages = workingConv.messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        const errBody = await res.json().catch(() => ({ error: "Terjadi kesalahan." }));
        throw new Error(errBody.error || "Terjadi kesalahan.");
      }

      // insert empty assistant message now that request succeeded
      setConversations((prev) =>
        prev.map((c) =>
          c.id === convId ? { ...c, messages: [...c.messages, assistantMsg] } : c
        )
      );

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";
      let firstChunk = true;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        if (!chunk) continue;
        if (firstChunk) {
          setIsThinking(false);
          firstChunk = false;
        }
        accumulated += chunk;
        setConversations((prev) =>
          prev.map((c) =>
            c.id === convId
              ? {
                  ...c,
                  messages: c.messages.map((m) =>
                    m.id === assistantId ? { ...m, content: accumulated } : m
                  ),
                }
              : c
          )
        );
      }
    } catch (err: any) {
      if (err?.name !== "AbortError") {
        setConversations((prev) =>
          prev.map((c) =>
            c.id === convId
              ? {
                  ...c,
                  messages: c.messages.some((m) => m.id === assistantId)
                    ? c.messages.map((m) =>
                        m.id === assistantId
                          ? { ...m, content: `⚠️ ${err.message || "Terjadi kesalahan."}` }
                          : m
                      )
                    : [
                        ...c.messages,
                        {
                          ...assistantMsg,
                          content: `⚠️ ${err.message || "Terjadi kesalahan."}`,
                        },
                      ],
                }
              : c
          )
        );
      }
    } finally {
      setIsThinking(false);
      setIsStreaming(false);
      abortRef.current = null;
    }
  }

  function handleStop() {
    abortRef.current?.abort();
    setIsStreaming(false);
    setIsThinking(false);
  }

  return (
    <div className="h-screen w-screen flex overflow-hidden">
      <Sidebar
        conversations={conversations}
        activeId={activeId}
        isOpen={sidebarOpen}
        onSelect={handleSelect}
        onNewChat={handleNewChat}
        onDelete={handleDelete}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 h-full">
        <Header
          theme={theme}
          onToggleTheme={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
          onOpenSidebar={() => setSidebarOpen(true)}
        />

        <ChatArea
          messages={activeConversation?.messages ?? []}
          isThinking={isThinking}
          onSuggestion={(text) => handleSend(text)}
        />

        <ChatInput
          value={input}
          onChange={setInput}
          onSend={() => handleSend()}
          onStop={handleStop}
          isStreaming={isStreaming}
        />
      </div>
    </div>
  );
}
