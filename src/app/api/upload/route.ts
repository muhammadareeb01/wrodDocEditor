import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { NextResponse } from "next/server";
import { validateFile, parseTextContent } from "@/utils/parseFile";

export async function POST(request: Request) {
  try {
    const supabase = createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file
    const validation = validateFile(file.name, file.size);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Read file content
    const rawText = await file.text();
    const textContent = parseTextContent(rawText);

    // Store in uploads table
    const { data, error } = await supabase
      .from("uploads")
      .insert({
        owner_id: user.id,
        filename: file.name,
        text_content: textContent,
      })
      .select("id, filename, text_content")
      .single();

    if (error) {
      console.error("Supabase insert error in upload:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      id: data.id,
      filename: data.filename,
      text_content: data.text_content,
    });
  } catch (err) {
    console.error("Internal server error in upload:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
