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
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (answer: string) => {
    if (!submitted) {
      setSelected(answer);
    }
  };

  const handleSubmit = () => {
    if (selected) {
      setSubmitted(true);
      onAnswer(selected);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-lg font-semibold">{question.question}</p>
      <div className="flex space-x-4">
        {['True', 'False'].map((option) => (
          <button
            key={option}
            className={`w-full p-3 rounded-lg border border-gray-500 transition-all ${
              submitted
                ? option === question.answer
                  ? 'bg-green-500 text-white'
                  : selected === option
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-800 text-gray-200'
                : selected === option
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
      {!submitted && (
        <button
          onClick={handleSubmit}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg disabled:bg-gray-500"
          disabled={!selected}
        >
          Submit
        </button>
      )}
    </div>
  );
};

export default TrueFalseQuestion;
