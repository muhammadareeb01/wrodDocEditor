export default function Footer() {
  return (
    <footer 
      className="w-full py-8 mt-auto" 
      style={{ borderTop: "1px solid var(--border-color)", background: "var(--bg-primary)" }}
    >
      <div className="max-w-6xl mx-auto px-4 flex flex-col items-center justify-center">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-3">
          <div
            className="w-7 h-7 rounded-md flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, var(--accent), var(--accent-hover))",
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
          <span
            className="text-white font-bold tracking-tight text-lg"
            style={{ color: "var(--text-primary)" }}
          >
            DocFlow
          </span>
        </div>
        
        <p className="text-sm mb-4 text-center max-w-md" style={{ color: "var(--text-secondary)" }}>
          A lightweight, collaborative rich-text document editor. Create, edit, and share files effortlessly in real-time.
        </p>

        <p className="text-xs" style={{ color: "var(--text-secondary)", opacity: 0.8 }}>
          &copy; 2026 DocFlow
        </p>
      </div>
    </footer>
  );
}
