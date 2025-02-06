import React, { useState, useEffect } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { motion } from 'framer-motion';

interface DraggableItemProps {
  id: string;
  text: string;
  onDrop: (item: any) => void;
}

const DraggableItem: React.FC<DraggableItemProps> = ({ id, text, onDrop }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'ITEM',
    item: { id, text },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <motion.div
      ref={drag}
      className={`p-3 bg-white/10 rounded-lg cursor-move border border-white/20 
        ${isDragging ? 'opacity-50' : 'opacity-100'} 
        hover:bg-white/20 transition-all duration-300`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {text}
    </motion.div>
  );
};

interface DropZoneProps {
  onDrop: (item: any) => void;
  children: React.ReactNode;
}

const DropZone: React.FC<DropZoneProps> = ({ onDrop, children }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'ITEM',
    drop: (item) => onDrop(item),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      className={`min-h-[200px] p-4 rounded-lg border-2 border-dashed 
        ${isOver ? 'border-blue-500 bg-blue-500/10' : 'border-white/20 bg-white/5'} 
        transition-all duration-300`}
    >
      {children}
    </div>
  );
};

interface DragDropQuestionProps {
  question: {
    type: string;
    question: string;
    options?: any[];
  };
  onAnswer: (answer: any) => void;
}

const DragDropQuestion: React.FC<DragDropQuestionProps> = ({ question, onAnswer }) => {
  const [availableItems, setAvailableItems] = useState<any[]>([]);
  const [droppedItems, setDroppedItems] = useState<any[]>([]);

  useEffect(() => {
    if (Array.isArray(question?.options)) {
      const items = question.options.map((option, index) => ({
        id: `item-${index}`,
        text: typeof option === 'string' ? option : option.term,
      }));
      setAvailableItems(items);
      setDroppedItems([]);
    }
  }, [question]);

  const handleDrop = (item: any) => {
    setDroppedItems(prev => [...prev, item]);
    setAvailableItems(prev => prev.filter(i => i.id !== item.id));
    onAnswer([...droppedItems, item].map(i => i.text));
  };

  if (!question) {
    return <div>No question data available</div>;
  }

  return (
    <div className="space-y-6 mt-4">
      <div className="text-lg">{question.question}</div>

      <DropZone onDrop={handleDrop}>
        {droppedItems.length === 0 ? (
          <div className="text-center text-gray-400">
            Drag items here
          </div>
        ) : (
          <div className="grid gap-2">
            {droppedItems.map((item) => (
              <div
                key={item.id}
                className="p-3 bg-white/10 rounded-lg border border-white/20"
              >
                {item.text}
              </div>
            ))}
          </div>
        )}
      </DropZone>

      {availableItems.length > 0 && (
        <div className="grid gap-2">
          {availableItems.map((item) => (
            <DraggableItem
              key={item.id}
              id={item.id}
              text={item.text}
              onDrop={handleDrop}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DragDropQuestion;
