# Architecture — DocFlow

## Overview

DocFlow is a lightweight collaborative document editor designed around simplicity, clean code, and a modern developer experience. This document explains the key architectural decisions.

---

## Why Tiptap?

**Tiptap** was chosen as the rich text editor for several reasons:

1. **Headless Architecture** — Tiptap provides the editor logic without imposing any UI, giving full control over the toolbar and styling to match the application's dark theme.
2. **JSON Content Model** — Tiptap stores content as JSON (not HTML), which maps naturally to Supabase's `jsonb` column type. This makes persistence trivial and avoids HTML sanitization concerns.
3. **Extensible** — The extension system (StarterKit, Underline, etc.) keeps the bundle lean — only the formatting features we need are included.
4. **React Integration** — `@tiptap/react` provides first-class React hooks (`useEditor`, `EditorContent`) that integrate cleanly with React state and effects.

### Alternative Considered
- **Slate.js** — More low-level, requires more boilerplate. Tiptap's StarterKit provided the right balance of features out-of-the-box.
- **Draft.js** — Older, less maintained, and Facebook has shifted focus away from it.

---

## Why Supabase?

**Supabase** serves as both the authentication provider and the database:

1. **Auth** — Built-in email/password authentication with JWT session management. The `@supabase/ssr` package handles cookie-based sessions seamlessly with Next.js middleware.
2. **PostgreSQL** — Full Postgres DB with `jsonb` support for storing Tiptap content natively.
3. **Row Level Security (RLS)** — Provides an additional security layer at the database level, ensuring users can only access their own data even if API routes have bugs.
4. **Admin API** — The service role key enables user lookup by email (for the sharing feature) without exposing user data to the client.

### Alternative Considered
- **Firebase** — Less suited for relational data and doesn't offer native `jsonb` or RLS.
- **Custom Auth** — Would require significant additional work for session management, password hashing, etc.

---

## Why App Router?

**Next.js 14 App Router** was chosen over the Pages Router:

1. **Server Components** — Default server rendering reduces client-side JavaScript. Pages that don't need interactivity (like the landing page) are automatically optimized.
2. **Route Handlers** — `app/api/.../route.ts` files provide a clean, co-located API structure that's easier to navigate than the Pages Router's `pages/api/` pattern.
3. **Middleware** — The middleware system integrates naturally with Supabase's cookie-based auth for route protection.
4. **Layouts** — The layout system enables shared UI (like the navbar) without prop drilling.

---

## What Is Intentionally Simplified

This application is intentionally kept lightweight. Here's what was simplified and why:

| Feature | Current State | Production Improvement |
|---------|---------------|----------------------|
| **Real-time collaboration** | Not implemented — single-user editing | Add Supabase Realtime or Yjs for CRDT-based collaboration |
| **Rich sharing permissions** | Binary share (yes/no) | Add roles: viewer, editor, commenter |
| **File storage** | Text extracted and stored in DB | Use Supabase Storage for raw files |
| **Version history** | Not implemented | Add document versioning with diff view |
| **Invite notifications** | No notifications | Email notifications via Supabase Edge Functions |
| **Search** | No document search | Full-text search on document content |
| **Theming** | Dark mode only | Add light mode toggle |
| **Mobile optimization** | Basic responsive | Full mobile-optimized editor experience |

---

## Data Flow

```
User → Browser → Supabase Auth (session)
                       ↓
              Next.js Middleware (route protection)
                       ↓
              Client Component → API Route Handler
                       ↓
              Server Supabase Client → PostgreSQL
```

### Auto-Save Flow
```
Editor onChange → setSaveStatus("unsaved")
                       ↓
              2-second debounce timer
                       ↓
              PUT /api/documents/[id] → Supabase update
                       ↓
              setSaveStatus("saved") + green indicator
```

---

## Security Model

1. **Middleware** — Redirects unauthenticated users from protected routes
2. **API Route Validation** — Every API route verifies the user session server-side
3. **Ownership Checks** — Update/share operations verify document ownership
4. **RLS Policies** — Database-level access control as a safety net
5. **Admin Client Isolation** — Service role key only used server-side for user lookups
