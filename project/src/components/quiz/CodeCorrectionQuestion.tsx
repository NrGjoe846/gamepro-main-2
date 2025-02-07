import React, { useState } from 'react';

interface CodeCorrectionQuestionProps {
  question: {
    question: string;
    options: string[];
    answer: string;
  };
  onAnswer: (answer: string) => void;
}

const CodeCorrectionQuestion: React.FC<CodeCorrectionQuestionProps> = ({ question, onAnswer }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    onAnswer(option);
  };

  return (
    <div className="space-y-4">
      <p className="text-lg font-semibold">{question.question}</p>
      <pre className="bg-gray-900 p-4 rounded-lg text-white border border-gray-600">{question.options[0]}</pre>
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

export default CodeCorrectionQuestion;
