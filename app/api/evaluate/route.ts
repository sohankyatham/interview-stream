import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { questions, answers } = await req.json();

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const prompt = `
You are a professional interviewer.

Evaluate the following interview answers.

For each answer, return:
- score (1-10)
- one strength
- one improvement

Respond ONLY in valid JSON.

Questions and Answers:
${questions.map((q: string, i: number) => `
Q: ${q}
A: ${answers[i]}
`).join("\n")}
`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    return NextResponse.json({ feedback: response });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Gemini evaluation failed" },
      { status: 500 }
    );
  }
}
