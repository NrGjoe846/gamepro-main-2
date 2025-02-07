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

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    onAnswer(option);
  };

  return (
    <div className="space-y-4">
      <p className="text-lg font-semibold">{question.question}</p>
      <div className="space-y-2">
        {question.options.map((option, index) => (
          <button
            key={index}
            className={`w-full p-3 rounded-lg border border-gray-500 ${
              selectedOption === option ? 'bg-blue-500 text-white' : 'bg-gray-800 text-gray-200'
            } transition-all`}
            onClick={() => handleSelect(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MultipleChoiceQuestion;
