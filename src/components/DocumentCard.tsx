"use client";

import Link from "next/link";
import { Document } from "@/types";

interface DocumentCardProps {
  document: Document;
  isShared?: boolean;
  onDelete?: (id: string) => void;
}

export default function DocumentCard({
  document,
  isShared = false,
  onDelete,
}: DocumentCardProps) {
  const formattedDate = new Date(document.updated_at).toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );

  return (
    <Link href={`/editor/${document.id}`}>
      <div
        className="doc-card p-5 rounded-2xl cursor-pointer"
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-color)",
        }}
      >
        <div className="flex items-start justify-between mb-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ background: "var(--accent-muted)" }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--accent)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Delete button (only if not shared) */}
            {!isShared && onDelete && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onDelete(document.id);
                }}
                className="p-2 rounded-lg transition-colors hover:bg-red-100/50 group"
                title="Delete document"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--danger)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="opacity-60 group-hover:opacity-100 transition-opacity"
                >
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  <line x1="10" y1="11" x2="10" y2="17"></line>
                  <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
              </button>
            )}

            {isShared && (
              <span
                className="text-xs px-2 py-1 rounded-full"
                style={{
                  background: "rgba(108, 99, 255, 0.1)",
                  color: "var(--accent)",
                  border: "1px solid rgba(108, 99, 255, 0.2)",
                }}
              >
                Shared
              </span>
            )}
          </div>
        </div>

        <h3
          className="font-semibold text-base mb-1 truncate"
          style={{ color: "var(--text-primary)" }}
        >
          {document.title || "Untitled Document"}
        </h3>

        <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
          {formattedDate}
        </p>
      </div>
    </Link>
  );
}
