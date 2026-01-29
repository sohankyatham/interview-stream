"use client";

import { useMemo, useState } from "react";

type Evaluation = {
  score: number;
  strength: string;
  improvement: string;
};

type AIItem = {
  question: string;
  answer: string;
  evaluation: Evaluation;
};

type AnswerSummaryProps = {
  questions: string[];
  answers: string[];
  onRestart: () => void;
};

function extractJson(text: string): string {
  // Removes ```json ... ``` or ``` ... ```
  return text
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();
}

export default function AnswerSummary({ questions, answers, onRestart }: AnswerSummaryProps) {
  const [rawFeedback, setRawFeedback] = useState<string | null>(null);
  const [parsed, setParsed] = useState<AIItem[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canEvaluate = answers.length === questions.length && answers.every(a => a.trim().length > 0);

  async function getAIFeedback() {
    try {
      setLoading(true);
      setError(null);
      setRawFeedback(null);
      setParsed(null);

      const res = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questions, answers }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || `Server error: ${res.status}`);
      }

      const text: string = data.feedback;
      setRawFeedback(text);

      // Try to parse JSON
      const jsonStr = extractJson(text);
      const obj = JSON.parse(jsonStr);

      // Minimal validation
      if (!Array.isArray(obj)) throw new Error("AI response JSON was not an array.");

      setParsed(obj as AIItem[]);
    } catch (err: any) {
      setError(err?.message ?? "Something went wrong while evaluating.");
    } finally {
      setLoading(false);
    }
  }

  const averageScore = useMemo(() => {
    if (!parsed || parsed.length === 0) return null;
    const total = parsed.reduce((sum, item) => sum + (item.evaluation?.score ?? 0), 0);
    return Math.round((total / parsed.length) * 10) / 10;
  }, [parsed]);

  return (
    <div className="border rounded-xl p-6 max-w-2xl shadow-sm space-y-4">
      <h2 className="text-2xl font-bold">Interview Summary</h2>

      {/* Always show what user answered */}
      <div className="space-y-4">
        {questions.map((q, i) => (
          <div key={i} className="border-b pb-4">
            <p className="font-semibold">Q{i + 1}: {q}</p>
            <p className="text-gray-800 mt-1">
              <span className="font-medium">Your answer:</span> {answers[i]}
            </p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 pt-2">
        <button
          onClick={getAIFeedback}
          disabled={loading || !canEvaluate}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg disabled:opacity-60"
        >
          {loading ? "Analyzing with Gemini..." : "Get AI Feedback"}
        </button>

        {!canEvaluate && (
          <p className="text-sm text-gray-600">
            Add an answer for every question before requesting AI feedback.
          </p>
        )}

        {error && (
          <p className="text-red-600">{error}</p>
        )}
      </div>

      {/* Pretty AI rendering */}
      {parsed && (
        <div className="mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">AI Evaluation</h3>
            {averageScore !== null && (
              <span className="text-sm bg-gray-100 text-gray-900 px-3 py-1 rounded-full">
                Avg Score: {averageScore}/10
              </span>
            )}
          </div>

          {parsed.map((item, idx) => (
            <div key={idx} className="rounded-xl border p-4 space-y-2">
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold">Question {idx + 1}</p>
                <span className="text-sm bg-green-100 text-green-900 px-3 py-1 rounded-full">
                  Score: {item.evaluation?.score ?? "?"}/10
                </span>
              </div>

              <p className="text-gray-800">
                <span className="font-medium">Strength:</span> {item.evaluation?.strength}
              </p>

              <p className="text-gray-800">
                <span className="font-medium">Improve:</span> {item.evaluation?.improvement}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* If parsing failed but raw exists, show raw */}
      {rawFeedback && !parsed && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">AI Feedback (raw)</h3>
          <pre className="bg-gray-100 text-gray-900 p-4 rounded-lg whitespace-pre-wrap text-sm">
            {rawFeedback}
          </pre>
        </div>
      )}

      <button
        onClick={onRestart}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg mt-2"
      >
        Restart Interview
      </button>
    </div>
  );
}