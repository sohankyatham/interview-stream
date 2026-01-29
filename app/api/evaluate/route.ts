import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

function extractJson(text: string): string {
  // remove ```json ... ``` if present
  let t = text.trim();
  t = t.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```$/i, "").trim();

  // If model returned extra text, try to grab the outermost JSON object
  const firstBrace = t.indexOf("{");
  const lastBrace = t.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    t = t.slice(firstBrace, lastBrace + 1);
  }
  return t;
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing GEMINI_API_KEY in .env.local" },
        { status: 500 }
      );
    }

    const body = await req.json();
    const questions = body?.questions;
    const answers = body?.answers;

    if (!Array.isArray(questions) || !Array.isArray(answers)) {
      return NextResponse.json(
        { error: "Invalid payload. Expected { questions: string[], answers: string[] }" },
        { status: 400 }
      );
    }

    if (questions.length !== answers.length) {
      return NextResponse.json(
        { error: "Questions and answers must have the same length." },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      // Lower randomness = more consistent JSON
      generationConfig: {
        temperature: 0.2,
      },
    });

    const prompt = `
You are a professional interviewer.

Return ONLY valid JSON. Do NOT use markdown. Do NOT wrap in backticks.
Return JSON in EXACTLY this shape:

{
  "results": [
    {
      "score": 1,
      "strength": "string",
      "improvement": "string"
    }
  ],
  "overallSummary": "string"
}

Rules:
- "results" length MUST equal the number of questions.
- score must be an integer 1-10.
- Keep strength/improvement short (1-2 sentences each).

Questions and Answers:
${questions
  .map((q: string, i: number) => `Q: ${q}\nA: ${answers[i] ?? ""}`)
  .join("\n\n")}
`.trim();

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Parse and return clean JSON to the frontend
    const jsonStr = extractJson(text);
    const parsed = JSON.parse(jsonStr);

    const results = parsed?.results;
    const overallSummary = parsed?.overallSummary;

    if (!Array.isArray(results)) {
      return NextResponse.json(
        {
          error:
            'Gemini returned JSON but missing "results" array. Returning raw text for debugging.',
          raw: text,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      results,
      overallSummary: typeof overallSummary === "string" ? overallSummary : "",
    });
  } catch (error: any) {
    console.error("Evaluate route error:", error);
    return NextResponse.json(
      { error: error?.message ?? "Gemini evaluation failed" },
      { status: 500 }
    );
  }
}