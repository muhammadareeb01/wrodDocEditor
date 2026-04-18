"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabaseClient";
import { Document } from "@/types";
import { toast } from "react-toastify";
import Navbar from "@/components/Navbar";
import TiptapEditor from "@/components/TiptapEditor";
import ShareModal from "@/components/ShareModal";

export default function EditorPage() {
  const params = useParams();
  const router = useRouter();
  const documentId = params.id as string;
  const supabase = createClient();

  const [document, setDocument] = useState<Document | null>(null);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    fetchDocument();
  }, [documentId]);

  const fetchDocument = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/documents/${documentId}`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to load document.");
        setLoading(false);
        return;
      }

      setDocument(data);
      setTitle(data.title || "Untitled Document");

      const {
        data: { user },
      } = await supabase.auth.getUser();
      setIsOwner(user?.id === data.owner_id);
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = useCallback(
    async (content: Record<string, unknown>) => {
      const response = await fetch(`/api/documents/${documentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, title }),
      });

      if (!response.ok) {
        const data = await response.json();
        toast.error(data.error || "Failed to save.");
        throw new Error(data.error || "Failed to save.");
      }
    },
    [documentId, title]
  );

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleTitleBlur = async () => {
    if (document && title !== document.title) {
      try {
        await fetch(`/api/documents/${documentId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title }),
        });
      } catch (err) {
        console.error("Failed to save title:", err);
        toast.error("Failed to save title.");
      }
    }
  };

  if (loading) {
    return (
      <div
        className="min-h-screen"
        style={{ background: "var(--bg-primary)" }}
      >
        <Navbar />
        <div className="flex items-center justify-center py-32">
          <div
            className="animate-spin w-8 h-8 border-2 rounded-full"
            style={{
              borderColor: "var(--border-color)",
              borderTopColor: "var(--accent)",
            }}
          />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="min-h-screen"
        style={{ background: "var(--bg-primary)" }}
      >
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <div className="text-5xl mb-4">😢</div>
          <h2
            className="text-xl font-bold mb-2"
            style={{ color: "var(--text-primary)" }}
          >
            Error
          </h2>
          <p
            className="text-sm mb-6"
            style={{ color: "var(--text-secondary)" }}
          >
            {error}
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white cursor-pointer"
            style={{
              background: "linear-gradient(135deg, var(--accent), var(--accent-hover))",
            }}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen pb-12"
      style={{ background: "var(--bg-primary)" }}
    >
      <Navbar />

      <div
        className="sticky top-16 z-30"
        style={{
          background: "var(--bg-primary)",
          borderBottom: "1px solid var(--border-color)",
        }}
      >
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <button
              onClick={() => router.push("/dashboard")}
              className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors cursor-pointer"
              style={{
                border: "1px solid var(--border-color)",
                color: "var(--text-secondary)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--accent)";
                e.currentTarget.style.color = "var(--accent)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border-color)";
                e.currentTarget.style.color = "var(--text-secondary)";
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              onBlur={handleTitleBlur}
              disabled={!isOwner}
              className="flex-1 text-lg font-semibold bg-transparent border-none outline-none min-w-0"
              style={{
                color: "var(--text-primary)",
              }}
              placeholder="Untitled Document"
            />
          </div>

          {isOwner && (
            <button
              onClick={() => setShareModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer flex-shrink-0"
              style={{
                border: "1px solid var(--border-color)",
                color: "var(--text-secondary)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--accent)";
                e.currentTarget.style.color = "var(--accent)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border-color)";
                e.currentTarget.style.color = "var(--text-secondary)";
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                <polyline points="16 6 12 2 8 6" />
                <line x1="12" y1="2" x2="12" y2="15" />
              </svg>
              Share
            </button>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-6">
        <div
          className="min-h-[75vh] rounded-xl shadow-lg transition-shadow"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-color)",
          }}
        >
          <TiptapEditor
            content={document?.content || null}
            onSave={handleSave}
            editable={true}
          />
        </div>
      </div>

      <ShareModal
        documentId={documentId}
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
      />
    </div>
  );
}
