export default function TypingIndicator() {
  return (
    <div className="w-full animate-fadeIn">
      <div className="max-w-3xl mx-auto px-4 py-4 flex gap-3">
        <div className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold bg-emerald-600 text-white">
          L
        </div>
        <div className="flex items-center gap-1 pt-2.5">
          <span
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ backgroundColor: "var(--text-secondary)", animationDelay: "0ms" }}
          />
          <span
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ backgroundColor: "var(--text-secondary)", animationDelay: "200ms" }}
          />
          <span
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ backgroundColor: "var(--text-secondary)", animationDelay: "400ms" }}
          />
        </div>
      </div>
    </div>
  );
}
