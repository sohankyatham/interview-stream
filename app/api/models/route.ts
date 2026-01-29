import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing GEMINI_API_KEY in .env.local" },
      { status: 500 }
    );
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

  const res = await fetch(url);
  const data = await res.json();

  return NextResponse.json(data, { status: res.status });
}
