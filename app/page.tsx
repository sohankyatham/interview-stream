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

  function nextQuestion() {
    setCurrentQuestion((prev) => prev + 1);
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6">
      <h1 className="text-4xl font-bold">
        InterviewStream
      </h1>

      <InterviewCard
        title="Behavioral Interview"
        description="Practice answering behavioral interview questions for job interviews."
        started={started}
        setStarted={setStarted}
        currentQuestion={currentQuestion}
        nextQuestion={nextQuestion}
        questions={questions}
      />
    </main>
  );
}