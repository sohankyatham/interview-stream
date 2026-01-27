"use client";

import { useState } from "react";

type InterviewCardProps = {
    title: string;
    description: string;
    started: boolean;
    setStarted: (started: boolean) => void;
    currentQuestion: number;
    nextQuestion: (answer: string) => void;
    questions: string[];
};

export default function InterviewCard({
    title,
    description,
    started,
    setStarted,
    currentQuestion,
    nextQuestion,
    questions,
}: InterviewCardProps) {
    const [currentAnswer, setCurrentAnswer] = useState("");

    const isLastQuestion = currentQuestion === questions.length - 1;

    return (
        <div className="border rounded-xl p-6 max-w-md shadow-sm">
            <h2 className="text-2xl font-semibold mb-2">
                {title}
            </h2>

            {!started && (
                <>
                    <p className="text-gray-600 mb-4">
                        {description}
                    </p>

                    <button
                        onClick={() => setStarted(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                    >
                        Start Interview
                    </button>
                </>
            )}

            {started && (
                <div className="mt-4 space-y-4">
                    <p className="font-medium">
                        Question {currentQuestion + 1}
                    </p>

                    <p className="text-gray-700">
                        {questions[currentQuestion]}
                    </p>

                    <textarea
                        className="w-full border rounded-md p-2"
                        placeholder="Type your answer here..."
                        value={currentAnswer}
                        onChange={(e) => setCurrentAnswer(e.target.value)}
                    />

                    {!isLastQuestion && (
                        <button
                            onClick={() => {
                                nextQuestion(currentAnswer);
                                setCurrentAnswer("");
                            }}
                            className="bg-blue-600 px-3 py-2 rounded-lg text-white"
                        >
                            Next Question
                        </button>
                    )}

                    {isLastQuestion && (
                        <button
                            onClick={() => {
                                // Save last answer
                                nextQuestion(currentAnswer);
                                setCurrentAnswer(""); // reset input
                                alert("Interview Complete! Answers saved."); // placeholder
                            }}
                            className="bg-green-600 px-3 py-2 rounded-lg text-white"
                        >
                            Finish Interview
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}