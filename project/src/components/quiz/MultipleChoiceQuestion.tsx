import React, { useState } from 'react';

interface MultipleChoiceQuestionProps {
  question: {
    question: string;
    options: string[];
    answer: string;
  };
  onAnswer: (answer: string) => void;
}

const MultipleChoiceQuestion: React.FC<MultipleChoiceQuestionProps> = ({ question, onAnswer }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (option: string) => {
    if (!submitted) {
      setSelectedOption(option);
    }
  };

  const handleSubmit = () => {
    if (selectedOption) {
      setSubmitted(true);
      onAnswer(selectedOption);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-lg font-semibold">{question.question}</p>
      <div className="space-y-2">
        {question.options.map((option, index) => (
          <button
            key={index}
            className={`w-full p-3 rounded-lg border border-gray-500 transition-all ${
              submitted
                ? option === question.answer
                  ? 'bg-green-500 text-white'
                  : selectedOption === option
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-800 text-gray-200'
                : selectedOption === option
                ? 'bg-blue-500 text-white'
                : 'bg-gray-800 text-gray-200'
            }`}
            onClick={() => handleSelect(option)}
            disabled={submitted}
          >
            {option}
          </button>
        ))}
      </div>
      <button
        onClick={handleSubmit}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg disabled:opacity-50"
        disabled={!selectedOption || submitted}
      >
        Submit
      </button>
    </div>
  );
};

export default MultipleChoiceQuestion;
