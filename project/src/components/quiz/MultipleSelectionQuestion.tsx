import React, { useState } from 'react';

interface MultipleSelectionQuestionProps {
  question: {
    question: string;
    options: string[];
    answer: string[];
  };
  onAnswer: (answer: string[]) => void;
}

const MultipleSelectionQuestion: React.FC<MultipleSelectionQuestionProps> = ({ question, onAnswer }) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const toggleSelection = (option: string) => {
    let updatedSelection = selectedOptions.includes(option)
      ? selectedOptions.filter((item) => item !== option)
      : [...selectedOptions, option];

    setSelectedOptions(updatedSelection);
    onAnswer(updatedSelection);
  };

  return (
    <div className="space-y-4">
      <p className="text-lg font-semibold">{question.question}</p>
      <div className="space-y-2">
        {question.options.map((option, index) => (
          <button
            key={index}
            className={`w-full p-3 rounded-lg border border-gray-500 ${
              selectedOptions.includes(option) ? 'bg-blue-500 text-white' : 'bg-gray-800 text-gray-200'
            } transition-all`}
            onClick={() => toggleSelection(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MultipleSelectionQuestion;
