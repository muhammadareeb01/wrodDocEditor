import type { Metadata } from "next";
import { ToastContainer } from "react-toastify";
import Footer from "@/components/Footer";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "DocFlow — Collaborative Document Editor",
  description:
    "A lightweight collaborative document editor built with Next.js, Tiptap, and Supabase. Create, edit, and share rich-text documents in real-time.",
  keywords: ["document editor", "collaborative", "tiptap", "nextjs", "supabase"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased flex flex-col min-h-screen">
        <main className="flex-1">{children}</main>
        <Footer />
        <ToastContainer 
          position="bottom-right" 
          autoClose={4000} 
          theme="dark"
          toastClassName="toast-glass" 
        />
      </body>
    </html>
  );
}
