import { useState } from 'react';
import { Check, X } from 'lucide-react';

const FillInTheBlankCode = ({ question, onAnswer }) => {
  const [userInput, setUserInput] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const isCorrect = userInput.trim() === question.answer;

  const handleSubmit = () => {
    setIsSubmitted(true);
    onAnswer(userInput);
  };

  return (
    <div className="space-y-4">
      <p className="text-lg font-semibold">{question.question}</p>
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          className={`px-4 py-2 border rounded-md focus:outline-none bg-gray-800 text-white ${isSubmitted ? (isCorrect ? 'border-green-500' : 'border-red-500') : 'border-gray-600'}`}
        />
      </div>
      <button
        onClick={handleSubmit}
        className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-all duration-300"
      >
        Submit
      </button>
      {isSubmitted && (
        <div className="flex items-center space-x-2">
          {isCorrect ? (
            <Check className="w-6 h-6 text-green-500" />
          ) : (
            <X className="w-6 h-6 text-red-500" />
          )}
          <span className={`text-lg ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>
            {isCorrect ? 'Correct!' : 'Incorrect, try again!'}
          </span>
        </div>
      )}
    </div>
  );
};

export default FillInTheBlankCode;
