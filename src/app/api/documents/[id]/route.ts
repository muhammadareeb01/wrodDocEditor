import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { NextResponse } from "next/server";

// GET /api/documents/[id] — Fetch a document by ID
export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    // Fetch the document
    const { data: document, error } = await supabase
      .from("documents")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !document) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    // Check if user is owner or has shared access
    if (document.owner_id !== user.id) {
      const { data: shared } = await supabase
        .from("shared_documents")
        .select("id")
        .eq("document_id", id)
        .eq("shared_with", user.id)
        .single();

      if (!shared) {
        return NextResponse.json(
          { error: "Access denied" },
          { status: 401 }
        );
      }
    }

    return NextResponse.json(document);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/documents/[id] — Update a document
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();

    // Verify ownership — only owners can update
    const { data: document } = await supabase
      .from("documents")
      .select("owner_id")
      .eq("id", id)
      .single();

    if (!document) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    // Allow both owner and shared users to edit
    if (document.owner_id !== user.id) {
      const { data: shared } = await supabase
        .from("shared_documents")
        .select("id")
        .eq("document_id", id)
        .eq("shared_with", user.id)
        .single();

      if (!shared) {
        return NextResponse.json(
          { error: "Access denied" },
          { status: 401 }
        );
      }
    }

    // Build update payload
    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (body.title !== undefined) updateData.title = body.title;
    if (body.content !== undefined) updateData.content = body.content;

    const { error } = await supabase
      .from("documents")
      .update(updateData)
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Document updated successfully" });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/documents/[id] — Delete a document
export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    // Fetch document to verify ownership
    const { data: document } = await supabase
      .from("documents")
      .select("owner_id")
      .eq("id", id)
      .single();

    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    // Only owner can delete
    if (document.owner_id !== user.id) {
      return NextResponse.json({ error: "Access denied. Only owner can delete." }, { status: 401 });
    }

    // Delete the document
    const { error } = await supabase
      .from("documents")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Document deleted successfully" });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
