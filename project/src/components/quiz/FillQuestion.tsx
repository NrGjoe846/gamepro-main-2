import React, { useState } from 'react';

interface FillQuestionProps {
  question: {
    type: string;
    question: string;
    answer: string; // The correct answer
  };
  onAnswer: (answer: string) => void;
}

const FillQuestion: React.FC<FillQuestionProps> = ({ question, onAnswer }) => {
  const [userInput, setUserInput] = useState<string>('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const handleSubmit = () => {
    const correct = userInput.trim().toLowerCase() === question.answer.trim().toLowerCase();
    setIsCorrect(correct);
    onAnswer(userInput);
  };

  return (
    <div className="space-y-4">
      <p className="text-lg font-semibold">{question.question}</p>

      <input
        type="text"
        value={userInput}
        onChange={(e) => {
          setUserInput(e.target.value);
          setIsCorrect(null); // Reset correctness state on change
        }}
        className={`w-full p-3 border rounded-lg text-black transition-all duration-300 
          ${isCorrect === null 
            ? 'border-gray-500 bg-white' 
            : isCorrect 
              ? 'border-green-500 bg-green-100' 
              : 'border-red-500 bg-red-100'}
        `}
        placeholder="Type your answer here..."
      />

      <button
        onClick={handleSubmit}
        className="w-full mt-4 px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg transition-all duration-300"
      >
        Submit Answer
      </button>
    </div>
  );
};

export default FillQuestion;
