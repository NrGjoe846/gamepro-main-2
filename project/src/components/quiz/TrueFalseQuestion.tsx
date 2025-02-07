import React, { useState } from 'react';

interface TrueFalseQuestionProps {
  question: {
    question: string;
    answer: string;
  };
  onAnswer: (answer: string) => void;
}

const TrueFalseQuestion: React.FC<TrueFalseQuestionProps> = ({ question, onAnswer }) => {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (answer: string) => {
    setSelected(answer);
    onAnswer(answer);
  };

  return (
    <div className="space-y-4">
      <p className="text-lg font-semibold">{question.question}</p>
      <div className="flex space-x-4">
        {['True', 'False'].map((option) => (
          <button
            key={option}
            className={`w-full p-3 rounded-lg border border-gray-500 ${
              selected === option ? 'bg-blue-500 text-white' : 'bg-gray-800 text-gray-200'
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

export default TrueFalseQuestion;
