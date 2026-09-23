"use client";

import { useState, ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { ChatMessage } from "@/lib/types";
import { IconCopy, IconCheck } from "./Icons";
import CodeBlock from "./CodeBlock";

function extractText(node: ReactNode): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (
    node &&
    typeof node === "object" &&
    "props" in (node as any) &&
    (node as any).props?.children
  ) {
    return extractText((node as any).props.children);
  }
  return "";
}

export default function Message({ message }: { message: ChatMessage }) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable
    }
  };

  return (
    <div className="w-full animate-fadeIn">
      <div
        className={`max-w-3xl mx-auto px-4 py-4 flex gap-3 ${
          isUser ? "flex-row-reverse" : "flex-row"
        }`}
      >
        <div
          className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${
            isUser ? "" : "bg-emerald-600 text-white"
          }`}
          style={
            isUser
              ? { backgroundColor: "var(--bg-hover)", color: "var(--text-primary)" }
              : undefined
          }
        >
          {isUser ? "U" : "L"}
        </div>

        <div
          className={`min-w-0 flex-1 ${isUser ? "flex justify-end" : ""}`}
        >
          <div
            className={`min-w-0 group ${isUser ? "max-w-[85%]" : "w-full"}`}
          >
            <div
              className={
                isUser
                  ? "rounded-2xl px-4 py-2.5 inline-block break-words whitespace-pre-wrap"
                  : "md-content break-words"
              }
              style={isUser ? { backgroundColor: "var(--bg-bubble-user)" } : undefined}
            >
              {isUser ? (
                message.content
              ) : (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight]}
                  components={{
                    pre({ children }) {
                      // find the inner <code> element to pull language + text
                      const codeEl = Array.isArray(children) ? children[0] : children;
                      const className =
                        (codeEl as any)?.props?.className || "";
                      const match = /language-(\w+)/.exec(className);
                      const language = match ? match[1] : "";
                      const text = extractText(
                        (codeEl as any)?.props?.children
                      );
                      return (
                        <CodeBlock language={language}>
                          {text.replace(/\n$/, "")}
                        </CodeBlock>
                      );
                    },
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              )}
            </div>

            {!isUser && message.content && (
              <button
                onClick={handleCopy}
                className="mt-1.5 flex items-center gap-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity px-1.5 py-1 rounded hover:opacity-100"
                style={{ color: "var(--text-secondary)" }}
              >
                {copied ? (
                  <>
                    <IconCheck className="w-3.5 h-3.5" /> Disalin
                  </>
                ) : (
                  <>
                    <IconCopy className="w-3.5 h-3.5" /> Salin
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
