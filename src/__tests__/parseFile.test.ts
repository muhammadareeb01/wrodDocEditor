import { describe, it, expect } from "vitest";
import {
  isAllowedFileType,
  validateFile,
  parseTextContent,
  textToTiptapJSON,
} from "@/utils/parseFile";

describe("parseFile utilities", () => {
  describe("isAllowedFileType", () => {
    it("allows .txt files", () => {
      expect(isAllowedFileType("document.txt")).toBe(true);
    });

    it("allows .md files", () => {
      expect(isAllowedFileType("readme.md")).toBe(true);
    });

    it("rejects .pdf files", () => {
      expect(isAllowedFileType("document.pdf")).toBe(false);
    });

    it("rejects .docx files", () => {
      expect(isAllowedFileType("document.docx")).toBe(false);
    });

    it("rejects files with no extension", () => {
      expect(isAllowedFileType("noextension")).toBe(false);
    });
  });

  describe("validateFile", () => {
    it("returns valid for allowed file types within size limit", () => {
      const result = validateFile("test.txt", 1024);
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it("returns invalid for unsupported file types", () => {
      const result = validateFile("test.pdf", 1024);
      expect(result.valid).toBe(false);
      expect(result.error).toContain("Unsupported file type");
    });

    it("returns invalid for files exceeding size limit", () => {
      const result = validateFile("test.txt", 10 * 1024 * 1024); // 10MB
      expect(result.valid).toBe(false);
      expect(result.error).toContain("File too large");
    });
  });

  describe("parseTextContent", () => {
    it("normalizes line endings", () => {
      const result = parseTextContent("line1\r\nline2\rline3\nline4");
      expect(result).toBe("line1\nline2\nline3\nline4");
    });

    it("trims whitespace", () => {
      const result = parseTextContent("  hello world  ");
      expect(result).toBe("hello world");
    });
  });

  describe("textToTiptapJSON", () => {
    it("converts plain text to Tiptap JSON format", () => {
      const result = textToTiptapJSON("Hello World");
      expect(result.type).toBe("doc");
      expect(result.content).toBeDefined();

      const content = result.content as Array<Record<string, unknown>>;
      expect(content.length).toBe(1);
      expect(content[0].type).toBe("paragraph");
    });

    it("converts markdown headings", () => {
      const result = textToTiptapJSON("# Main Title");
      const content = result.content as Array<Record<string, unknown>>;
      expect(content[0].type).toBe("heading");
      expect((content[0].attrs as Record<string, unknown>).level).toBe(1);
    });

    it("converts H2 headings", () => {
      const result = textToTiptapJSON("## Sub Title");
      const content = result.content as Array<Record<string, unknown>>;
      expect(content[0].type).toBe("heading");
      expect((content[0].attrs as Record<string, unknown>).level).toBe(2);
    });

    it("converts bullet points", () => {
      const result = textToTiptapJSON("- Item one");
      const content = result.content as Array<Record<string, unknown>>;
      expect(content[0].type).toBe("bulletList");
    });

    it("handles empty text", () => {
      const result = textToTiptapJSON("");
      expect(result.type).toBe("doc");
      const content = result.content as Array<Record<string, unknown>>;
      expect(content.length).toBeGreaterThan(0);
    });

    it("returns a complete document structure", () => {
      const result = textToTiptapJSON("# Title\n\nParagraph text\n\n- Bullet item");
      expect(result.type).toBe("doc");
      const content = result.content as Array<Record<string, unknown>>;
      expect(content.length).toBeGreaterThan(1);
    });
  });
});
