import { createServerSupabaseClient } from "@/lib/supabaseServer";
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

    // Optional body for creating from uploaded file
    let title = "Untitled Document";
    let content: Record<string, unknown> = {
      type: "doc",
      content: [{ type: "paragraph" }],
    };

    try {
      const body = await request.json();
      if (body.title) title = body.title;
      if (body.content) content = body.content;
    } catch {
      // No body provided — use defaults
    }

    const { data, error } = await supabase
      .from("documents")
      .insert({
        owner_id: user.id,
        title,
        content,
      })
      .select("id, title")
      .single();

    if (error) {
      console.error("Supabase insert error in documents/create:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ id: data.id, title: data.title });
  } catch (err) {
    console.error("Internal server error in documents/create:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
