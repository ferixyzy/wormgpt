"use client";

import { useState } from "react";
import { IconCopy, IconCheck } from "./Icons";

interface CodeBlockProps {
  language: string;
  children: string;
}

export default function CodeBlock({ language, children }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(children);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable
    }
  };

  return (
    <div className="code-block-wrapper">
      <div className="code-block-header">
        <span>{language || "text"}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 px-2 py-1 rounded hover:bg-white/10 transition-colors"
        >
          {copied ? (
            <>
              <IconCheck className="w-3.5 h-3.5" /> Disalin
            </>
          ) : (
            <>
              <IconCopy className="w-3.5 h-3.5" /> Salin kode
            </>
          )}
        </button>
      </div>
      <pre className="!mt-0 !rounded-t-none">
        <code className={language ? `hljs language-${language}` : "hljs"}>
          {children}
        </code>
      </pre>
    </div>
  );
}
