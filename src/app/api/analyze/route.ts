import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const mode = process.env.NEXT_PUBLIC_INFERENCE_MODE ?? "mock";
    
    // In mock mode, this route shouldn't be called (handled client-side),
    // but if it is, return a 501 Not Implemented.
    if (mode === "mock") {
      return NextResponse.json(
        { message: "Server inference is not implemented in mock mode. Use the client-side mock service." },
        { status: 501 }
      );
    }

    const formData = await request.formData();
    const image = formData.get("image") as File;

    if (!image) {
      return NextResponse.json(
        { message: "No image provided" },
        { status: 400 }
      );
    }

    const INFERENCE_SERVER_URL = process.env.INFERENCE_SERVER_URL;
    if (!INFERENCE_SERVER_URL) {
      return NextResponse.json(
        { message: "INFERENCE_SERVER_URL environment variable is not configured." },
        { status: 500 }
      );
    }

    // Forward the formData to the Python inference backend
    const response = await fetch(`${INFERENCE_SERVER_URL}/analyze`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Inference server responded with ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    return NextResponse.json(result);

  } catch (error: any) {
    console.error("API Analyze Error:", error);
    return NextResponse.json(
      { message: error.message || "Internal server error during analysis." },
      { status: 500 }
    );
  }
}
