import React, { useState, useEffect } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { motion } from 'framer-motion';

interface DraggableItemProps {
  id: string;
  text: string;
}

const DraggableItem: React.FC<{ item: DraggableItemProps; isDisabled: boolean }> = ({ item, isDisabled }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'ITEM',
    item,
    canDrag: !isDisabled, // Prevent dragging if already placed
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <motion.div
      ref={drag}
      className={`p-3 bg-gray-800 text-white rounded-lg cursor-pointer border border-gray-400 
        ${isDragging ? 'opacity-50' : isDisabled ? 'opacity-30 cursor-not-allowed' : 'opacity-100'} 
        hover:bg-gray-700 transition-all duration-300`}
      whileHover={!isDisabled ? { scale: 1.05 } : {}}
      whileTap={!isDisabled ? { scale: 0.95 } : {}}
    >
      {item.text}
    </motion.div>
  );
};

interface DropZoneProps {
  onDrop: (item: DraggableItemProps) => void;
  droppedItems: DraggableItemProps[];
  dropLimit: number;
}

const DropZone: React.FC<DropZoneProps> = ({ onDrop, droppedItems, dropLimit }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'ITEM',
    drop: (item: DraggableItemProps) => {
      if (droppedItems.length < dropLimit) {
        onDrop(item);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      className={`min-h-[80px] p-4 rounded-lg border-2 border-dashed flex flex-wrap gap-2 
        ${isOver ? 'border-green-400 bg-green-900/10' : 'border-gray-500 bg-gray-900/10'} 
        transition-all duration-300`}
    >
      {droppedItems.length === 0 ? (
        <div className="text-center text-gray-400">Drag items here</div>
      ) : (
        droppedItems.map((item) => (
          <motion.div
            key={item.id}
            className="p-3 bg-blue-600 text-white rounded-lg border border-white"
          >
            {item.text}
          </motion.div>
        ))
      )}
    </div>
  );
};

interface DragDropQuestionProps {
  question: {
    type: string;
    question: string;
    options: string[];
    answer: string[];
  };
  onAnswer: (answer: string[]) => void;
}

const DragDropQuestion: React.FC<DragDropQuestionProps> = ({ question, onAnswer }) => {
  const [availableItems, setAvailableItems] = useState<DraggableItemProps[]>([]);
  const [droppedItems, setDroppedItems] = useState<DraggableItemProps[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    if (Array.isArray(question?.options)) {
      setAvailableItems(
        question.options.map((option, index) => ({
          id: `item-${index}`,
          text: option,
        }))
      );
      setDroppedItems([]); // Reset dropped items
      setSubmitted(false);
      setIsCorrect(null);
    }
  }, [question]);

  const handleDrop = (item: DraggableItemProps) => {
    if (droppedItems.length < question.answer.length) {
      setDroppedItems((prev) => [...prev, item]);
    }
  };

  const handleSubmit = () => {
    if (droppedItems.length !== question.answer.length) return;

    const userAnswer = droppedItems.map((item) => item.text);
    const correct = JSON.stringify(userAnswer) === JSON.stringify(question.answer);
    setIsCorrect(correct);
    setSubmitted(true);
    onAnswer(userAnswer);

    if (!correct) {
      setTimeout(() => {
        setDroppedItems([]);
        setSubmitted(false);
        setIsCorrect(null);
      }, 1500);
    }
  };

  return (
    <div className="space-y-6 mt-4">
      <div className="text-lg font-semibold">{question.question}</div>

      <DropZone onDrop={handleDrop} droppedItems={droppedItems} dropLimit={question.answer.length} />

      {availableItems.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {availableItems.map((item) => (
            <DraggableItem key={item.id} item={item} isDisabled={droppedItems.some((d) => d.id === item.id)} />
          ))}
        </div>
      )}

      <button
        onClick={handleSubmit}
        className={`w-full p-3 mt-4 text-white font-bold rounded-lg transition-all flex items-center justify-center 
          ${submitted ? (isCorrect ? 'bg-green-500' : 'bg-red-500') : 'bg-blue-600 hover:bg-blue-700'} 
          ${droppedItems.length !== question.answer.length ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={droppedItems.length !== question.answer.length}
      >
        {submitted ? (isCorrect ? '✅ Correct!' : '❌ Try Again!') : 'Submit'}
      </button>
    </div>
  );
};

export default DragDropQuestion;
