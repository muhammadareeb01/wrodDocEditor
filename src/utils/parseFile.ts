// ============================================================
// File Parsing Utilities
// Supports .txt and .md file content extraction
// ============================================================

const ALLOWED_EXTENSIONS = [".txt", ".md"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export function isAllowedFileType(filename: string): boolean {
  const ext = filename.toLowerCase().slice(filename.lastIndexOf("."));
  return ALLOWED_EXTENSIONS.includes(ext);
}

export function validateFile(
  filename: string,
  size: number
): { valid: boolean; error?: string } {
  if (!isAllowedFileType(filename)) {
    return {
      valid: false,
      error: `Unsupported file type. Only ${ALLOWED_EXTENSIONS.join(", ")} files are allowed.`,
    };
  }

  if (size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB.`,
    };
  }

  return { valid: true };
}

export function parseTextContent(text: string): string {
  // Clean up the text content — normalize line endings and trim
  return text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim();
}

export function textToTiptapJSON(text: string): Record<string, unknown> {
  const lines = text.split("\n");
  const content: Record<string, unknown>[] = [];

  for (const line of lines) {
    if (line.trim() === "") {
      content.push({
        type: "paragraph",
        content: [],
      });
    } else {
      // Check for markdown headings
      const h1Match = line.match(/^#\s+(.+)/);
      const h2Match = line.match(/^##\s+(.+)/);
      const bulletMatch = line.match(/^[-*]\s+(.+)/);

      if (h1Match) {
        content.push({
          type: "heading",
          attrs: { level: 1 },
          content: [{ type: "text", text: h1Match[1] }],
        });
      } else if (h2Match) {
        content.push({
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: h2Match[1] }],
        });
      } else if (bulletMatch) {
        // Wrap bullet items in a bulletList
        content.push({
          type: "bulletList",
          content: [
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [{ type: "text", text: bulletMatch[1] }],
                },
              ],
            },
          ],
        });
      } else {
        content.push({
          type: "paragraph",
          content: [{ type: "text", text: line }],
        });
      }
    }
  }

  return {
    type: "doc",
    content: content.length > 0 ? content : [{ type: "paragraph" }],
  };
}
