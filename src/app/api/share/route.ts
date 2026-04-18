import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { createAdminClient } from "@/lib/supabaseAdmin";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const supabase = createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { document_id, email } = await request.json();

    if (!document_id || !email) {
      return NextResponse.json(
        { error: "Document ID and email are required" },
        { status: 400 }
      );
    }

    // Prevent sharing with yourself
    if (email === user.email) {
      return NextResponse.json(
        { error: "You cannot share a document with yourself" },
        { status: 400 }
      );
    }

    // Verify ownership
    const { data: document } = await supabase
      .from("documents")
      .select("owner_id")
      .eq("id", document_id)
      .single();

    if (!document) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    if (document.owner_id !== user.id) {
      return NextResponse.json(
        { error: "Only the document owner can share it" },
        { status: 401 }
      );
    }

    // Find user by email using admin client (to look up other users)
    const adminClient = createAdminClient();
    const { data: usersData, error: usersError } =
      await adminClient.auth.admin.listUsers();

    if (usersError) {
      return NextResponse.json(
        { error: "Failed to look up user" },
        { status: 500 }
      );
    }

    const targetUser = usersData.users.find((u) => u.email === email);

    if (!targetUser) {
      return NextResponse.json(
        { error: "No user found with that email" },
        { status: 404 }
      );
    }

    // Check if already shared (using adminClient to bypass RLS)
    const { data: existing } = await adminClient
      .from("shared_documents")
      .select("id")
      .eq("document_id", document_id)
      .eq("shared_with", targetUser.id)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: "Document is already shared with this user" },
        { status: 400 }
      );
    }

    // Create share record (using adminClient to bypass RLS)
    const { error: shareError } = await adminClient
      .from("shared_documents")
      .insert({
        document_id,
        shared_with: targetUser.id,
      });

    if (shareError) {
      return NextResponse.json(
        { error: shareError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: `Document shared with ${email} successfully`,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
