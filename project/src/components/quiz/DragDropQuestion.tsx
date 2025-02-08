import { useState } from 'react';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { CheckCircle, XCircle } from 'lucide-react';

const ItemType = 'WORD';

const DraggableWord = ({ word, index, moveWord }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { index, word },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className={`px-4 py-2 bg-blue-500 text-white rounded-md cursor-pointer m-1 ${isDragging ? 'opacity-50' : ''}`}
    >
      {word}
    </div>
  );
};

const DropZone = ({ moveWord, words }) => {
  const [, drop] = useDrop({
    accept: ItemType,
    drop: (item) => moveWord(item.index),
  });

  return (
    <div ref={drop} className="px-4 py-4 border rounded-md min-w-[300px] min-h-[150px] text-center flex flex-wrap gap-2 items-center justify-center">
      {words.map((word, index) => (
        <div key={index} className="px-4 py-2 bg-gray-700 text-white rounded-md">
          {word}
        </div>
      ))}
    </div>
  );
};

const DragDropQuestion = ({ question, onAnswer }) => {
  // Debugging - Log the received question
  console.log('Received question:', question);
  
  if (!question || !question.options) {
    return <p className="text-red-500">Error: Question data is missing.</p>;
  }

  const options = question?.options ?? [];
  const answer = question?.answer ?? [];

  const [userAnswer, setUserAnswer] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const moveWord = (fromIndex) => {
    if (!userAnswer.includes(options[fromIndex])) {
      setUserAnswer([...userAnswer, options[fromIndex]]);
    }
  };

  const handleSubmit = () => {
    const correct = JSON.stringify(userAnswer) === JSON.stringify(answer);
    setIsCorrect(correct);
    setIsSubmitted(true);
    onAnswer(userAnswer);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-4">
        <p className="text-lg font-semibold">{question?.question ?? 'Loading question...'}</p>
        <DropZone moveWord={moveWord} words={userAnswer} />
        <div className="flex flex-wrap mt-4">
          {options.map((word, index) => (
            <DraggableWord key={index} word={word} index={index} moveWord={moveWord} />
          ))}
        </div>
        {!isSubmitted && (
          <button
            onClick={handleSubmit}
            className="w-full p-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all flex items-center justify-center"
          >
            Submit <CheckCircle className="w-5 h-5 ml-2" />
          </button>
        )}
        {isSubmitted && (
          <div className="flex items-center space-x-2">
            {isCorrect ? (
              <CheckCircle className="w-6 h-6 text-green-500" />
            ) : (
              <XCircle className="w-6 h-6 text-red-500" />
            )}
            <span className={`text-lg ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>
              {isCorrect ? 'Correct!' : 'Incorrect, try again!'}
            </span>
          </div>
        )}
      </div>
    </DndProvider>
  );
};

export default DragDropQuestion;
