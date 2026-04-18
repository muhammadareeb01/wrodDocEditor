# DocFlow Collaborative Document Editor

Hello! This is a complete online document editor and real time collaboration workspace I developed over the last 5 hours. It is built natively with Next.js 14 and Supabase.

I wanted to keep the user experience simple but fully functional. I focused on a clean modern UI that feels like a premium productivity tool while ensuring the core rich text editing features work flawlessly.

## Key Features Built During This Sprint

1. **Secure Authentication** 
Set up Supabase Auth for simple email and password login to protect user data and ensure secure access to the dashboard and workspace.

2. **Rich Text Editor Engine** 
Integrated Tiptap to build a powerful rich text editing experience. It features automatic saving to silently sync changes to the cloud without interrupting the creative flow. The canvas UI is designed to feel like a real sheet of paper.

3. **Cloud Database and Sharing System** 
Designed PostgreSQL database tables for document management and team collaboration permissions. I implemented a robust "Share via Email" feature so you can easily invite colleagues to view and collaborate on your files. The dashboard neatly separates your personal files from shared teamwork.

4. **Instant File Imports**
Instead of forcing users to always start from scratch, I wrote a custom file parser. You can directly upload plain text or markdown files to automatically convert them into a fully editable online document.

5. **Modern UI Polish**
Designed a bright and soft interface using custom CSS variables for a premium visual aesthetic. Integrated toast notifications for smooth user feedback and wrote automated Vitest software testing to validate file parsing logic.

## Technical Stack Overview
* Next.js 14 App Router
* React and TypeScript
* Tailwind CSS
* Supabase PostgreSQL Database and Auth
* Tiptap Rich Text Engine

## Setup Instructions

If you want to run this application locally:

1. Clone the repository and install all packages using `npm install`
2. Duplicate the `.env.local.example` file to create a `.env` file and paste in your Supabase API keys.
3. Run the SQL queries from `database.sql` directly in your Supabase SQL editor to create the necessary tables.
4. Start the frontend development server using `npm run dev`

That is everything! It is a fast and lightweight collaborative writing tool that handles team sharing perfectly.

---
&copy; 2026 DocFlow
