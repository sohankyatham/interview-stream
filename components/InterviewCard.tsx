"use client";

type InterviewCardProps = {
  title: string;
  description: string;
  started: boolean;
  setStarted: (started: boolean) => void;
  currentQuestion: number;
  nextQuestion: () => void;
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
  return (
    <div className="border rounded-xl p-6 max-w-md shadow-sm">
      <h2 className="text-2xl font-semibold mb-2">
        {title}
      </h2>

      {!started && (
        <>
          <p className="text-white-600 mb-4">
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

          <p className="text-white">
            {questions[currentQuestion]}
          </p>

          {currentQuestion < questions.length - 1 && (
            <button
              onClick={nextQuestion}
              className="bg-blue-600 px-3 py-2 rounded-lg"
            >
              Next Question
            </button>
          )}
        </div>
      )}
    </div>
  );
}
