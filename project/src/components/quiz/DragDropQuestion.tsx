import React, { useState, useEffect } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { motion } from 'framer-motion';

// Define types for the draggable items
interface DraggableItemProps {
  id: string;
  text: string;
}

const DraggableItem: React.FC<{ item: DraggableItemProps }> = ({ item }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'ITEM',
    item,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <motion.div
      ref={drag}
      className={`p-3 bg-gray-800 text-white rounded-lg cursor-pointer border border-gray-400 
        ${isDragging ? 'opacity-50' : 'opacity-100'} 
        hover:bg-gray-700 transition-all duration-300`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {item.text}
    </motion.div>
  );
};

interface DropZoneProps {
  onDrop: (item: DraggableItemProps) => void;
  droppedItems: DraggableItemProps[];
}

const DropZone: React.FC<DropZoneProps> = ({ onDrop, droppedItems }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'ITEM',
    drop: (item: DraggableItemProps) => onDrop(item),
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

  useEffect(() => {
    if (Array.isArray(question?.options)) {
      setAvailableItems(
        question.options.map((option, index) => ({
          id: `item-${index}`,
          text: option,
        }))
      );
      setDroppedItems([]); // Reset dropped items
    }
  }, [question]);

 const handleDrop = (item: DraggableItemProps) => {
  console.log("Dropped:", item);
  setDroppedItems((prev) => [...prev, item]);
};


  return (
    <div className="space-y-6 mt-4">
      <div className="text-lg font-semibold">{question.question}</div>

      <DropZone onDrop={handleDrop} droppedItems={droppedItems} />

      {availableItems.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {availableItems.map((item) => (
            <DraggableItem key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default DragDropQuestion;
