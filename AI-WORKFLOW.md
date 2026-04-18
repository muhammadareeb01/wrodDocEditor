# AI Workflow — DocFlow

## Overview

This document details how AI assistance was used in building DocFlow and where human judgment was applied.

---

## What AI Helped With

### 1. Project Scaffolding
- Generated the Next.js 14 project with TypeScript, Tailwind CSS, and App Router configuration
- Installed and configured all dependencies (Supabase, Tiptap, Vitest)
- Set up the complete folder structure following the specified architecture

### 2. Component Generation
- Created all React components (Navbar, DocumentCard, TiptapEditor, ShareModal, FileUpload)
- Generated consistent styling across components using CSS custom properties
- Built the Tiptap editor integration with toolbar, auto-save, and status indicators

### 3. API Route Implementation
- Generated all four API route handlers (create, read/update, share, upload)
- Implemented authorization checks and error handling patterns
- Created the file validation and text-to-Tiptap JSON conversion utilities

### 4. Database Schema
- Generated the complete SQL schema with tables, foreign keys, and constraints
- Created comprehensive Row Level Security (RLS) policies
- Designed the relational model for documents, shares, and uploads

### 5. Testing
- Generated unit tests for the file parsing utilities
- Configured Vitest with path aliases and jsdom environment

### 6. Documentation
- Generated README, ARCHITECTURE, and SUBMISSION documents
- Created environment variable templates

---

## Where Judgment Was Applied

### 1. Architecture Decisions
- **Client vs Server Components**: Chose to make pages with interactivity (dashboard, editor, auth) as client components, while keeping the landing page as a server component for performance.
- **Supabase Client Strategy**: Used three separate client patterns (browser, server, admin) based on context requirements rather than a single shared client.
- **Auto-Save Timing**: Set the debounce to 2 seconds — balancing between too-frequent saves (network waste) and too-slow saves (data loss risk).

### 2. Security Design
- Implemented dual-layer auth: middleware for route protection + API-level session validation
- Separated the admin client (service role) from user-facing clients to prevent privilege escalation
- Added RLS policies as a defense-in-depth measure beyond API route checks
- Prevented self-sharing explicitly in the API to avoid confusing UX

### 3. UX/UI Choices
- Designed a cohesive dark theme with CSS custom properties for consistency
- Used inline title editing (not a separate modal) for better editing flow
- Placed save status indicators in the toolbar for constant visibility
- Implemented fade-in animations and hover effects for a polished feel

### 4. Error Handling
- Chose user-friendly error messages over technical details
- Implemented graceful degradation (editor loading states, empty states)
- Added file size limits (5MB) and type validation for uploads

---

## What Was Changed Manually

- Fine-tuned the CSS custom properties color palette for visual harmony
- Adjusted the toolbar layout and button sizing for touch-friendly targets
- Refined the middleware configuration to handle edge cases (auth page redirects)
- Optimized the auto-save logic to prevent race conditions with `useRef` flags

---

## AI Tools Used

- **Code Generation**: AI generated the initial codebase structure, components, and API routes
- **Documentation**: AI assisted with comprehensive documentation
- **Testing**: AI generated test cases covering edge cases
- **Code Review**: AI performed analysis of potential issues and suggested fixes
