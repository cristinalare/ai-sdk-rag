import { NextRequest } from "next/server";
import { createResource } from "@/lib/actions/resources";

export async function POST(req: NextRequest) {
  if (req.headers.get("x-admin-key") !== process.env.ADMIN_KEY) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return Response.json({ error: "No file uploaded" }, { status: 400 });
    }

    let content = "";
    if (file.type === "text/plain" || file.name.endsWith(".txt")) {
      content = await file.text();
    } else if (
      file.type === "application/json" ||
      file.name.endsWith(".json")
    ) {
      content = await file.text();
    } else if (file.name.endsWith(".md")) {
      content = await file.text();
    } else {
      return Response.json(
        { error: "Only TXT, JSON, and MD files supported" },
        { status: 400 }
      );
    }

    if (!content.trim()) {
      return Response.json(
        { error: "File appears to be empty" },
        { status: 400 }
      );
    }

    const result = await createResource({ content });

    return Response.json({
      success: true,
      message: `Successfully processed ${file.name}. ${result}`,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return Response.json(
      {
        error: "Upload failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
