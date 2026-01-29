"use client";

import { useMemo, useState } from "react";

type AIResult = {
  score: number; // 1-10
  strength: string;
  improvement: string;
};

type AnswerSummaryProps = {
  questions: string[];
  answers: string[];
  onRestart: () => void;
};

export default function AnswerSummary({ questions, answers, onRestart }: AnswerSummaryProps) {
  const [results, setResults] = useState<AIResult[] | null>(null);
  const [overallSummary, setOverallSummary] = useState<string>("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canEvaluate =
    answers.length === questions.length && answers.every((a) => a.trim().length > 0);

  async function getAIFeedback() {
    try {
      setLoading(true);
      setError(null);
      setResults(null);
      setOverallSummary("");

      const res = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questions, answers }),
      });

      const data = await res.json();

      if (!res.ok) {
        // If backend includes raw text for debugging, show it
        const msg = data?.error || `Server error: ${res.status}`;
        throw new Error(msg);
      }

      // Backend now returns clean JSON:
      // { results: [...], overallSummary: "..." }
      setResults(data.results);
      setOverallSummary(data.overallSummary || "");
    } catch (err: any) {
      setError(err?.message ?? "Something went wrong while evaluating.");
    } finally {
      setLoading(false);
    }
  }

  const averageScore = useMemo(() => {
    if (!results || results.length === 0) return null;
    const total = results.reduce((sum, r) => sum + (typeof r.score === "number" ? r.score : 0), 0);
    return Math.round((total / results.length) * 10) / 10;
  }, [results]);

  return (
    <div className="border rounded-xl p-6 max-w-2xl shadow-sm space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">Interview Summary</h2>

      {/* Always show user answers */}
      <div className="space-y-4">
        {questions.map((q, i) => (
          <div key={i} className="border-b pb-4">
            <p className="font-semibold text-gray-900">Q{i + 1}: {q}</p>
            <p className="text-gray-900 mt-1">
              <span className="font-medium">Your answer:</span> {answers[i]}
            </p>
          </div>
        ))}
      </div>

      {/* Action */}
      <div className="flex flex-col gap-2 pt-2">
        <button
          onClick={getAIFeedback}
          disabled={loading || !canEvaluate}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg disabled:opacity-60"
        >
          {loading ? "Analyzing with Gemini..." : "Get AI Feedback"}
        </button>

        {!canEvaluate && (
          <p className="text-sm text-gray-700">
            Add an answer for every question before requesting AI feedback.
          </p>
        )}

        {error && <p className="text-red-600">{error}</p>}
      </div>

      {/* AI Evaluation */}
      {results && (
        <div className="mt-4 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-xl font-semibold text-gray-900">AI Evaluation</h3>
            {averageScore !== null && (
              <span className="text-sm bg-gray-100 text-gray-900 px-3 py-1 rounded-full">
                Avg Score: {averageScore}/10
              </span>
            )}
          </div>

          {overallSummary && (
            <div className="rounded-xl border bg-gray-50 p-4 text-gray-900">
              <p className="font-semibold mb-1">Overall Summary</p>
              <p>{overallSummary}</p>
            </div>
          )}

          {results.map((r, idx) => (
            <div key={idx} className="rounded-xl border p-4 space-y-2">
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold text-gray-900">Question {idx + 1}</p>
                <span className="text-sm bg-green-100 text-green-900 px-3 py-1 rounded-full">
                  Score: {r.score}/10
                </span>
              </div>

              <p className="text-gray-900">
                <span className="font-medium">Strength:</span> {r.strength}
              </p>

              <p className="text-gray-900">
                <span className="font-medium">Improve:</span> {r.improvement}
              </p>
            </div>
          ))}
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
