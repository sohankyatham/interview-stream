"use client";

import { useState } from "react";
import InterviewCard from "@/components/InterviewCard";

const questions = [
  "Tell me about a time you faced a challenge or conflict at work. How did you handle it?",
  "Describe a time you worked on a team and had to collaborate with different personalities.",
  "Describe a situation where you had to learn something quickly.",
];

export default function Home() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [started, setStarted] = useState(false);
  const [answers, setAnswers] = useState<string[]>([]);
  const [finished, setFinished] = useState(false); // new

  function nextQuestion(answer: string) {
    setAnswers((prev) => [...prev, answer]);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      // last question completed
      setFinished(true); // mark finished
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6">
      <h1 className="text-4xl font-bold">InterviewStream</h1>

      {!finished && (
        <InterviewCard
          title="Behavioral Interview"
          description="Practice answering behavioral interview questions for job interviews."
          started={started}
          setStarted={setStarted}
          currentQuestion={currentQuestion}
          nextQuestion={nextQuestion}
          questions={questions}
        />
      )}

      {finished && (
        <div className="mt-6 text-center">
          <h2 className="text-2xl font-semibold mb-2">Interview Complete!</h2>
          <p className="mb-4">Your answers have been saved.</p>
          <button
            onClick={() => {
              // reset to start over if desired
              setStarted(false);
              setCurrentQuestion(0);
              setAnswers([]);
              setFinished(false);
            }}
            className="bg-blue-600 px-4 py-2 rounded-lg text-white"
          >
            Restart Interview
          </button>
        </div>
      )}
    </main>
  );
}