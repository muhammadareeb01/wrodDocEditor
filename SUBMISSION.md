# Submission — DocFlow

## 📦 Included Files

### Core Application
| File | Purpose |
|------|---------|
| `src/app/page.tsx` | Landing page |
| `src/app/login/page.tsx` | Login page |
| `src/app/signup/page.tsx` | Signup page |
| `src/app/dashboard/page.tsx` | Dashboard with My Docs / Shared tabs |
| `src/app/editor/[id]/page.tsx` | Document editor page |
| `src/app/layout.tsx` | Root layout with metadata |
| `src/app/globals.css` | Global styles and design system |

### Components
| File | Purpose |
|------|---------|
| `src/components/Navbar.tsx` | Navigation bar with logout |
| `src/components/DocumentCard.tsx` | Document card for dashboard grid |
| `src/components/TiptapEditor.tsx` | Rich text editor with toolbar |
| `src/components/ShareModal.tsx` | Share document modal |
| `src/components/FileUpload.tsx` | File upload button component |

### API Routes
| File | Method | Purpose |
|------|--------|---------|
| `src/app/api/documents/create/route.ts` | POST | Create new document |
| `src/app/api/documents/[id]/route.ts` | GET, PUT | Read/update document |
| `src/app/api/share/route.ts` | POST | Share document by email |
| `src/app/api/upload/route.ts` | POST | Upload and parse file |

### Library & Utils
| File | Purpose |
|------|---------|
| `src/lib/supabaseClient.ts` | Browser Supabase client |
| `src/lib/supabaseServer.ts` | Server Supabase client |
| `src/lib/supabaseAdmin.ts` | Admin Supabase client (service role) |
| `src/utils/parseFile.ts` | File validation and parsing |
| `src/types/index.ts` | TypeScript type definitions |
| `src/middleware.ts` | Auth middleware for route protection |

### Tests
| File | Purpose |
|------|---------|
| `src/__tests__/parseFile.test.ts` | Unit tests for file parsing utilities |
| `vitest.config.ts` | Test configuration |

### Documentation
| File | Purpose |
|------|---------|
| `README.md` | Setup, usage, and deployment guide |
| `ARCHITECTURE.md` | Technical architecture decisions |
| `AI-WORKFLOW.md` | AI assistance documentation |
| `SUBMISSION.md` | This file |
| `.env.local.example` | Environment variable template |

---

## ✅ What Works

1. **Authentication**
   - Sign up with email & password
   - Login with email & password
   - Logout
   - Session persistence across page refreshes
   - Protected route middleware

2. **Document Management**
   - Create new documents
   - View documents on dashboard
   - Open and edit documents
   - Inline title renaming
   - Delete protection (only via Supabase directly)

3. **Rich Text Editing**
   - Bold, Italic, Underline formatting
   - H1 and H2 headings
   - Bullet lists and ordered lists
   - Auto-save every 2 seconds
   - Manual save button
   - Visual save status indicator (Saved / Saving… / Unsaved)

4. **Sharing**
   - Share documents by email
   - Shared documents appear in "Shared With Me" tab
   - Shared users can view and edit the document
   - Self-sharing prevention
   - Duplicate share prevention

5. **File Upload**
   - Upload .txt and .md files
   - Text extraction and parsing
   - Create documents from uploaded files
   - File type and size validation
   - Records stored in uploads table

6. **UI/UX**
   - Dark theme with consistent design system
   - Responsive layout
   - Loading states and empty states
   - Error handling with user-friendly messages
   - Smooth animations and transitions
   - Glass-morphism effects

---

## ⚠️ What Is Incomplete (If Any)

| Feature | Status | Notes |
|---------|--------|-------|
| Real-time collaboration | Not included | Would require Yjs or Supabase Realtime |
| Email notifications | Not included | No notification on document share |
| Document deletion | Not included | Only via Supabase dashboard |
| Version history | Not included | No document revision tracking |
| Light mode | Not included | Dark mode only |

---

## 🔮 What I'd Do With 2 Extra Hours

1. **Real-Time Collaboration** (~45 min)
   - Integrate Yjs with Tiptap's collaboration extension
   - Add awareness cursors showing other users editing
   - Set up Supabase Realtime channels for sync

2. **Document Deletion & Management** (~20 min)
   - Add delete button with confirmation modal
   - Add document duplication
   - Add sort/filter options on dashboard

3. **Enhanced Sharing** (~30 min)
   - Add permission levels (viewer/editor)
   - Show list of shared users on the document
   - Allow revoking shared access
   - Add email notifications via Supabase Edge Functions

4. **Polish** (~25 min)
   - Add light/dark mode toggle
   - Add keyboard shortcuts (Ctrl+B, Ctrl+I, etc.)
   - Add export as .md or .txt
   - Add document search on dashboard
   - Improve mobile editor experience
