import React, { useState } from "react";

interface OrderingQuestionProps {
  question: {
    type: string;
    question: string;
    options: string[]; // Unordered options
    correctOrder: string[]; // Correct order
  };
  onAnswer: (isCorrect: boolean) => void;
}

const OrderingQuestion: React.FC<OrderingQuestionProps> = ({ question, onAnswer }) => {
  const [userOrder, setUserOrder] = useState<string[]>([...question.options]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const handleChange = (index: number, selectedIndex: number) => {
    const newOrder = [...userOrder];
    const [item] = newOrder.splice(index, 1); // Remove the item from its old position
    newOrder.splice(selectedIndex, 0, item); // Insert it at the new position
    setUserOrder(newOrder);
    setIsCorrect(null); // Reset correctness state
  };

  const handleSubmit = () => {
    const correct = JSON.stringify(userOrder) === JSON.stringify(question.correctOrder);
    setIsCorrect(correct);
    onAnswer(correct);
  };

  return (
    <div className="space-y-4">
      <p className="text-lg font-semibold">{question.question}</p>

      <div className="space-y-2">
        {userOrder.map((option, index) => (
          <div key={option} className="flex items-center space-x-4 p-2 border rounded-lg bg-gray-100">
            <select
              value={index}
              onChange={(e) => handleChange(index, parseInt(e.target.value))}
              className="p-2 border rounded-lg"
            >
              {userOrder.map((_, i) => (
                <option key={i} value={i}>
                  {i + 1}
                </option>
              ))}
            </select>
            <span>{option}</span>
          </div>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        className="w-full mt-4 px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg transition-all duration-300"
      >
        Submit Answer
      </button>

      {isCorrect !== null && (
        <p className={`mt-2 p-2 text-white rounded-lg ${isCorrect ? "bg-green-500" : "bg-red-500"}`}>
          {isCorrect ? "Correct Order!" : "Incorrect Order, Try Again!"}
        </p>
      )}
    </div>
  );
};

export default OrderingQuestion;
