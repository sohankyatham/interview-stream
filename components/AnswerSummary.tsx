"use client";

type AnswerSummaryProps = {
    questions: string[];
    answers: string[];
    onRestart: () => void;
};

export default function AnswerSummary({ questions, answers, onRestart }: AnswerSummaryProps) {

    // simple keyword scoring
    const keywordScores: Record<string, number> = {
        teamwork: 5,
        leadership: 5,
        communication: 4,
        "problem-solving": 5,
        "time management": 3,
        "fast learner": 4,
    };

    function calculateScore(answer: string) {
        let score = 0;
        const lowerAnswer = answer.toLowerCase();
        for (const keyword in keywordScores) {
            if (lowerAnswer.includes(keyword)) {
                score += keywordScores[keyword];
            }
        }
        return score;
    }

    return (
        <div className="border rounded-xl p-6 max-w-md shadow-sm space-y-4">
            <h2 className="text-2xl font-bold mb-4">Interview Summary</h2>

            {questions.map((q, i) => (
                <div key={i} className="border-b pb-2 mb-2">
                    <p className="font-semibold">Q{i + 1}: {q}</p>
                    <p className="text-gray-700 mt-1">
                        A: {answers[i].split(" ").map((word, idx) => (
                            Object.keys(keywordScores).includes(word.toLowerCase())
                                ? <span key={idx} className="text-green-600 font-semibold">{word} </span>
                                : word + " "
                        ))}
                    </p>
                    <p className="mt-1 font-medium text-green-700">
                        Score: {calculateScore(answers[i])} / 5+
                    </p>
                </div>
            ))}

            <button
                onClick={onRestart}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg mt-4"
            >
                Restart Interview
            </button>
        </div>
    );
}