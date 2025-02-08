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
  const [submitted, setSubmitted] = useState<boolean>(false);

  const toggleSelection = (option: string) => {
    if (submitted) return; // Prevent selection after submission

    let updatedSelection = selectedOptions.includes(option)
      ? selectedOptions.filter((item) => item !== option)
      : [...selectedOptions, option];

    setSelectedOptions(updatedSelection);
  };

  const checkAnswer = () => {
    setSubmitted(true);
    onAnswer(selectedOptions);
  };

  const isCorrect = (option: string) => question.answer.includes(option);

  return (
    <div className="space-y-4">
      <p className="text-lg font-semibold">{question.question}</p>
      <div className="space-y-2">
        {question.options.map((option, index) => (
          <button
            key={index}
            className={`w-full p-3 rounded-lg border border-gray-500 transition-all 
              ${submitted ? (isCorrect(option) ? 'bg-green-500 text-white' : selectedOptions.includes(option) ? 'bg-red-500 text-white' : 'bg-gray-800 text-gray-200')
              : selectedOptions.includes(option) ? 'bg-blue-500 text-white' : 'bg-gray-800 text-gray-200'}`}
            onClick={() => toggleSelection(option)}
            disabled={submitted} // Disable buttons after submission
          >
            {option}
          </button>
        ))}
      </div>
      {!submitted && (
        <button
          onClick={checkAnswer}
          className="w-full p-3 mt-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all"
        >
          Submit
        </button>
      )}
    </div>
  );
};

export default MultipleSelectionQuestion;
