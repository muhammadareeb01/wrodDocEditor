"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { useEffect, useCallback, useRef, useState } from "react";

interface TiptapEditorProps {
  content: Record<string, unknown> | null;
  onSave: (content: Record<string, unknown>) => Promise<void>;
  editable?: boolean;
}

interface ToolbarButtonProps {
  onClick: () => void;
  isActive: boolean;
  label: string;
  children: React.ReactNode;
}

function ToolbarButton({
  onClick,
  isActive,
  label,
  children,
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      className={`toolbar-btn w-9 h-9 rounded-lg flex items-center justify-center text-sm font-medium cursor-pointer ${
        isActive ? "is-active" : ""
      }`}
      style={{
        color: isActive ? "var(--accent)" : "var(--text-secondary)",
        background: isActive ? "var(--accent-muted)" : "transparent",
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.background = "var(--bg-hover)";
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.background = "transparent";
        }
      }}
    >
      {children}
    </button>
  );
}

export default function TiptapEditor({
  content,
  onSave,
  editable = true,
}: TiptapEditorProps) {
  const [saveStatus, setSaveStatus] = useState<
    "saved" | "saving" | "unsaved"
  >("saved");
  const autoSaveTimer = useRef<NodeJS.Timeout | null>(null);
  const isSaving = useRef(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2],
        },
      }),
      Underline,
    ],
    content: content || {
      type: "doc",
      content: [{ type: "paragraph" }],
    },
    immediatelyRender: false,
    editable,
    editorProps: {
      attributes: {
        class: "tiptap",
      },
    },
    onUpdate: () => {
      setSaveStatus("unsaved");
    },
  });

  // Save handler
  const handleSave = useCallback(async () => {
    if (!editor || isSaving.current) return;

    isSaving.current = true;
    setSaveStatus("saving");

    try {
      const json = editor.getJSON() as Record<string, unknown>;
      await onSave(json);
      setSaveStatus("saved");
    } catch (err) {
      console.error("Save failed:", err);
      setSaveStatus("unsaved");
    } finally {
      isSaving.current = false;
    }
  }, [editor, onSave]);

  // Auto-save every 2 seconds when content changes
  useEffect(() => {
    if (saveStatus === "unsaved") {
      if (autoSaveTimer.current) {
        clearTimeout(autoSaveTimer.current);
      }
      autoSaveTimer.current = setTimeout(() => {
        handleSave();
      }, 2000);
    }

    return () => {
      if (autoSaveTimer.current) {
        clearTimeout(autoSaveTimer.current);
      }
    };
  }, [saveStatus, handleSave]);

  // Update editor content when prop changes externally
  useEffect(() => {
    if (editor && content) {
      const currentContent = JSON.stringify(editor.getJSON());
      const newContent = JSON.stringify(content);
      if (currentContent !== newContent) {
        editor.commands.setContent(content);
      }
    }
  }, [editor, content]);

  if (!editor) {
    return (
      <div className="flex items-center justify-center py-20">
        <div
          className="animate-spin w-8 h-8 border-2 rounded-full"
          style={{
            borderColor: "var(--border-color)",
            borderTopColor: "var(--accent)",
          }}
        />
      </div>
    );
  }

  return (
    <div>
      {/* Toolbar */}
      <div
        className="sticky top-16 z-40 flex items-center gap-1 px-4 py-2 flex-wrap"
        style={{
          background: "var(--bg-secondary)",
          borderBottom: "1px solid var(--border-color)",
        }}
      >
        {/* Bold */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          label="Bold"
        >
          <strong>B</strong>
        </ToolbarButton>

        {/* Italic */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          label="Italic"
        >
          <em>I</em>
        </ToolbarButton>

        {/* Underline */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive("underline")}
          label="Underline"
        >
          <u>U</u>
        </ToolbarButton>

        {/* Separator */}
        <div
          className="w-px h-6 mx-1"
          style={{ background: "var(--border-color)" }}
        />

        {/* H1 */}
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          isActive={editor.isActive("heading", { level: 1 })}
          label="Heading 1"
        >
          H1
        </ToolbarButton>

        {/* H2 */}
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          isActive={editor.isActive("heading", { level: 2 })}
          label="Heading 2"
        >
          H2
        </ToolbarButton>

        {/* Separator */}
        <div
          className="w-px h-6 mx-1"
          style={{ background: "var(--border-color)" }}
        />

        {/* Bullet List */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
          label="Bullet List"
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
            <line x1="8" y1="6" x2="21" y2="6" />
            <line x1="8" y1="12" x2="21" y2="12" />
            <line x1="8" y1="18" x2="21" y2="18" />
            <line x1="3" y1="6" x2="3.01" y2="6" />
            <line x1="3" y1="12" x2="3.01" y2="12" />
            <line x1="3" y1="18" x2="3.01" y2="18" />
          </svg>
        </ToolbarButton>

        {/* Ordered List */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
          label="Numbered List"
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
            <line x1="10" y1="6" x2="21" y2="6" />
            <line x1="10" y1="12" x2="21" y2="12" />
            <line x1="10" y1="18" x2="21" y2="18" />
            <path d="M4 6h1v4" />
            <path d="M4 10h2" />
            <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" />
          </svg>
        </ToolbarButton>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Save status indicator */}
        <div className="flex items-center gap-2 text-sm">
          {saveStatus === "saving" && (
            <>
              <div
                className="w-2 h-2 rounded-full animate-pulse-dot"
                style={{ background: "var(--warning)" }}
              />
              <span style={{ color: "var(--warning)" }}>Saving…</span>
            </>
          )}
          {saveStatus === "saved" && (
            <>
              <div
                className="w-2 h-2 rounded-full"
                style={{ background: "var(--success)" }}
              />
              <span style={{ color: "var(--success)" }}>Saved</span>
            </>
          )}
          {saveStatus === "unsaved" && (
            <>
              <div
                className="w-2 h-2 rounded-full"
                style={{ background: "var(--text-secondary)" }}
              />
              <span style={{ color: "var(--text-secondary)" }}>Unsaved</span>
            </>
          )}
        </div>

        {/* Manual save button */}
        <button
          onClick={handleSave}
          disabled={saveStatus === "saving" || saveStatus === "saved"}
          className="ml-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-40 cursor-pointer"
          style={{
            background: "var(--accent-muted)",
            color: "var(--accent)",
          }}
        >
          Save
        </button>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />
    </div>
  );
}
