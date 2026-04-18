"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { Document, SharedDocument } from "@/types";
import { toast } from "react-toastify";
import Navbar from "@/components/Navbar";
import DocumentCard from "@/components/DocumentCard";
import FileUpload from "@/components/FileUpload";
import { textToTiptapJSON } from "@/utils/parseFile";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"my" | "shared">("my");
  const [myDocs, setMyDocs] = useState<Document[]>([]);
  const [sharedDocs, setSharedDocs] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    fetchDocuments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDocuments = async () => {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    // Fetch my documents
    const { data: owned } = await supabase
      .from("documents")
      .select("*")
      .eq("owner_id", user.id)
      .order("updated_at", { ascending: false });

    setMyDocs(owned || []);

    // Fetch shared documents
    const { data: shared } = await supabase
      .from("shared_documents")
      .select("*, documents(*)")
      .eq("shared_with", user.id)
      .order("created_at", { ascending: false });

    const sharedDocsList = (shared as SharedDocument[] | null)
      ?.map((s) => s.documents)
      .filter(Boolean) as Document[];

    setSharedDocs(sharedDocsList || []);
    setLoading(false);
  };

  const handleCreateDocument = async () => {
    const response = await fetch("/api/documents/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();

    if (response.ok && data.id) {
      toast.success("Document created!");
      router.push(`/editor/${data.id}`);
    } else {
      toast.error(data.error || "Failed to create document.");
    }
  };

  const handleFileUploaded = async (text: string, filename: string) => {
    // Create a new document from uploaded file
    const content = textToTiptapJSON(text);
    const title = filename.replace(/\.(txt|md)$/i, "");

    const response = await fetch("/api/documents/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });

    const data = await response.json();

    if (response.ok && data.id) {
      toast.success("Document created from file!");
      router.push(`/editor/${data.id}`);
    } else {
      toast.error(data.error || "Failed to create document from file.");
    }
  };

  const handleDeleteDocument = async (id: string) => {
    if (!confirm("Are you sure you want to delete this document?")) return;

    const response = await fetch(`/api/documents/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      toast.success("Document deleted!");
      setMyDocs((prev) => prev.filter((doc) => doc.id !== id));
    } else {
      const data = await response.json();
      toast.error(data.error || "Failed to delete document");
    }
  };

  const tabs = [
    { key: "my" as const, label: "My Documents", count: myDocs.length },
    {
      key: "shared" as const,
      label: "Shared With Me",
      count: sharedDocs.length,
    },
  ];

  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--bg-primary)" }}
    >
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1
              className="text-2xl font-bold mb-1"
              style={{ color: "var(--text-primary)" }}
            >
              Dashboard
            </h1>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Manage your documents
            </p>
          </div>

          <div className="flex items-center gap-3">
            <FileUpload onFileUploaded={handleFileUploaded} />

            <button
              onClick={handleCreateDocument}
              className="btn-glow inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white cursor-pointer"
              style={{
                background: "linear-gradient(135deg, var(--accent), var(--accent-hover))",
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              New Document
            </button>
          </div>
        </div>

        <div
          className="flex gap-1 p-1 rounded-xl mb-6 inline-flex"
          style={{ background: "var(--bg-secondary)" }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer"
              style={{
                background:
                  activeTab === tab.key ? "var(--bg-card)" : "transparent",
                color:
                  activeTab === tab.key
                    ? "var(--text-primary)"
                    : "var(--text-secondary)",
                boxShadow:
                  activeTab === tab.key
                    ? "0 2px 8px rgba(0,0,0,0.2)"
                    : "none",
              }}
            >
              {tab.label}
              <span
                className="ml-2 text-xs px-1.5 py-0.5 rounded-full"
                style={{
                  background:
                    activeTab === tab.key
                      ? "var(--accent-muted)"
                      : "var(--bg-hover)",
                  color:
                    activeTab === tab.key
                      ? "var(--accent)"
                      : "var(--text-secondary)",
                }}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div
              className="animate-spin w-8 h-8 border-2 rounded-full"
              style={{
                borderColor: "var(--border-color)",
                borderTopColor: "var(--accent)",
              }}
            />
          </div>
        ) : (
          <>
            {activeTab === "my" && (
              <div className="animate-fade-in">
                {myDocs.length === 0 ? (
                  <div
                    className="text-center py-20 rounded-2xl"
                    style={{
                      background: "var(--bg-secondary)",
                      border: "1px solid var(--border-color)",
                    }}
                  >
                    <div className="text-4xl mb-4">📝</div>
                    <h3
                      className="font-semibold mb-2"
                      style={{ color: "var(--text-primary)" }}
                    >
                      No documents yet
                    </h3>
                    <p
                      className="text-sm mb-6"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      Create your first document to get started
                    </p>
                    <button
                      onClick={handleCreateDocument}
                      className="btn-glow px-6 py-2.5 rounded-xl text-sm font-semibold text-white cursor-pointer"
                      style={{
                        background:
                          "linear-gradient(135deg, var(--accent), var(--accent-hover))",
                      }}
                    >
                      Create Document
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {myDocs.map((doc) => (
                      <DocumentCard key={doc.id} document={doc} onDelete={handleDeleteDocument} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "shared" && (
              <div className="animate-fade-in">
                {sharedDocs.length === 0 ? (
                  <div
                    className="text-center py-20 rounded-2xl"
                    style={{
                      background: "var(--bg-secondary)",
                      border: "1px solid var(--border-color)",
                    }}
                  >
                    <div className="text-4xl mb-4">🔗</div>
                    <h3
                      className="font-semibold mb-2"
                      style={{ color: "var(--text-primary)" }}
                    >
                      No shared documents
                    </h3>
                    <p
                      className="text-sm"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      Documents shared with you will appear here
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sharedDocs.map((doc) => (
                      <DocumentCard
                        key={doc.id}
                        document={doc}
                        isShared
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
