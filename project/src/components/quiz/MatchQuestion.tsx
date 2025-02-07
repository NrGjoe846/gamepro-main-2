import React, { useState } from 'react';

interface MatchQuestionProps {
  question: {
    type: string;
    question: string;
    options: { term: string; match: string }[];
  };
  onAnswer: (answer: { term: string; match: string }[]) => void;
}

const MatchQuestion: React.FC<MatchQuestionProps> = ({ question, onAnswer }) => {
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ match: string; isCorrect: boolean } | null>(null);

  const handleSelectTerm = (term: string) => {
    setSelectedTerm(term);
    setFeedback(null); // Reset feedback when selecting a new term
  };

  const handleSelectMatch = (match: string) => {
    if (!selectedTerm) return;

    const correctMatch = question.options.find((option) => option.term === selectedTerm)?.match === match;
    setFeedback({ match, isCorrect: correctMatch });

    if (correctMatch) {
      onAnswer([{ term: selectedTerm, match }]); // Send correct answer
    }

    setTimeout(() => {
      setSelectedTerm(null);
      setFeedback(null);
    }, 1000); // Reset selection after 1 second
  };

  return (
    <div className="space-y-4">
      <p className="text-lg font-semibold">{question.question}</p>

      <div className="grid grid-cols-2 gap-4 border border-gray-500 p-4 rounded-lg">
        <div className="space-y-2">
          <h3 className="text-sm font-bold">Terms</h3>
          {question.options.map((option) => (
            <button
              key={option.term}
              onClick={() => handleSelectTerm(option.term)}
              className={`block w-full p-3 rounded-lg text-left border transition-all
                ${
                  selectedTerm === option.term
                    ? 'bg-blue-500 text-white shadow-lg scale-105'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
            >
              {option.term}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-bold">Matches</h3>
          {question.options.map((option) => (
            <button
              key={option.match}
              onClick={() => handleSelectMatch(option.match)}
              className={`block w-full p-3 rounded-lg text-left border transition-all
                ${
                  feedback?.match === option.match
                    ? feedback.isCorrect
                      ? 'bg-green-500 text-white shadow-lg scale-105'
                      : 'bg-red-500 text-white shadow-lg scale-105'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
            >
              {option.match}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MatchQuestion;
