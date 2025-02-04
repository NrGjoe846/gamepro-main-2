import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Shuffle, ArrowRight, ArrowLeft, ArrowUp, ArrowDown } from 'lucide-react';

interface QuizTypeProps {
  type: string;
  question: string;
  options?: string[];
  code?: string;
  answer: string | number | number[];
  onAnswer: (answer: any) => void;
  explanation: string;
  showExplanation: boolean;
  isCorrect: boolean | null;
}

export const FillBlank: React.FC<QuizTypeProps> = ({ question, code, onAnswer, isCorrect }) => {
  const [input, setInput] = useState('');

  return (
    <div className="space-y-4">
      <p className="text-lg">{question}</p>
      {code && (
        <pre className="bg-black/30 p-4 rounded-lg overflow-x-auto">
          <code>{code.replace('___', '_____')}</code>
        </pre>
      )}
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className={`w-full p-3 bg-white/10 border ${
          isCorrect === null ? 'border-white/20' :
          isCorrect ? 'border-green-500' : 'border-red-500'
        } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
        placeholder="Type your answer..."
      />
      <button
        onClick={() => onAnswer(input)}
        className="w-full py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-all duration-300"
      >
        Submit
      </button>
    </div>
  );
};

export const MultipleChoice: React.FC<QuizTypeProps> = ({ question, options = [], onAnswer, isCorrect }) => {
  return (
    <div className="space-y-4">
      <p className="text-lg">{question}</p>
      <div className="space-y-2">
        {options.map((option, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onAnswer(index)}
            className={`w-full p-4 text-left rounded-lg transition-all duration-300 ${
              isCorrect === null ? 'bg-white/10 hover:bg-white/20' :
              isCorrect && index === 1 ? 'bg-green-500/20 border-green-500' :
              !isCorrect && index === 1 ? 'bg-red-500/20 border-red-500' :
              'bg-white/10'
            } border border-white/20`}
          >
            {option}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export const TrueFalse: React.FC<QuizTypeProps> = ({ question, onAnswer, isCorrect }) => {
  return (
    <div className="space-y-4">
      <p className="text-lg">{question}</p>
      <div className="grid grid-cols-2 gap-4">
        {['True', 'False'].map((option) => (
          <motion.button
            key={option}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onAnswer(option.toLowerCase() === 'true')}
            className={`p-4 rounded-lg transition-all duration-300 ${
              isCorrect === null ? 'bg-white/10 hover:bg-white/20' :
              isCorrect ? 'bg-green-500/20 border-green-500' :
              'bg-red-500/20 border-red-500'
            } border border-white/20`}
          >
            {option}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export const WordScramble: React.FC<QuizTypeProps> = ({ question, options = [], onAnswer, isCorrect }) => {
  const [words, setWords] = useState(options);
  
  const shuffleWords = () => {
    setWords([...words].sort(() => Math.random() - 0.5));
  };

  return (
    <div className="space-y-4">
      <p className="text-lg">{question}</p>
      <div className="flex flex-wrap gap-2">
        {words.map((word, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            className="px-3 py-1 bg-white/10 rounded-lg cursor-move"
          >
            {word}
          </motion.div>
        ))}
      </div>
      <div className="flex gap-2">
        <button
          onClick={shuffleWords}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-300"
        >
          <Shuffle className="w-5 h-5" />
        </button>
        <button
          onClick={() => onAnswer(words.join(' '))}
          className="flex-1 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-all duration-300"
        >
          Check Answer
        </button>
      </div>
    </div>
  );
};

export const MatchOutput: React.FC<QuizTypeProps> = ({ question, options = [], onAnswer, isCorrect }) => {
  const [matches, setMatches] = useState<Record<string, string>>({});

  const handleMatch = (code: string, output: string) => {
    setMatches(prev => ({
      ...prev,
      [code]: output
    }));
  };

  return (
    <div className="space-y-4">
      <p className="text-lg">{question}</p>
      <div className="space-y-4">
        {options.map((code, index) => (
          <div key={index} className="flex items-center gap-4">
            <pre className="flex-1 bg-black/30 p-4 rounded-lg overflow-x-auto">
              <code>{code}</code>
            </pre>
            <select
              value={matches[code] || ''}
              onChange={(e) => handleMatch(code, e.target.value)}
              className="p-2 bg-white/10 rounded-lg border border-white/20"
            >
              <option value="">Select output</option>
              {options.map((_, i) => (
                <option key={i} value={`Output ${i + 1}`}>
                  Output {i + 1}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
      <button
        onClick={() => onAnswer(matches)}
        className="w-full py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-all duration-300"
      >
        Check Matches
      </button>
    </div>
  );
};

export const MultipleSelection: React.FC<QuizTypeProps> = ({ question, options = [], onAnswer, isCorrect }) => {
  const [selected, setSelected] = useState<number[]>([]);

  const toggleSelection = (index: number) => {
    setSelected(prev => 
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <div className="space-y-4">
      <p className="text-lg">{question}</p>
      <div className="space-y-2">
        {options.map((option, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => toggleSelection(index)}
            className={`w-full p-4 text-left rounded-lg transition-all duration-300 ${
              selected.includes(index) ? 'bg-blue-500/20 border-blue-500' : 'bg-white/10'
            } border border-white/20`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-md border ${
                selected.includes(index) ? 'bg-blue-500 border-blue-500' : 'border-white/20'
              }`}>
                {selected.includes(index) && <Check className="w-4 h-4 text-white" />}
              </div>
              {option}
            </div>
          </motion.button>
        ))}
      </div>
      <button
        onClick={() => onAnswer(selected)}
        className="w-full py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-all duration-300"
      >
        Submit Selection
      </button>
    </div>
  );
};

export const Ordering: React.FC<QuizTypeProps> = ({ question, options = [], onAnswer, isCorrect }) => {
  const [steps, setSteps] = useState(options);

  const moveStep = (from: number, to: number) => {
    const newSteps = [...steps];
    const [removed] = newSteps.splice(from, 1);
    newSteps.splice(to, 0, removed);
    setSteps(newSteps);
  };

  return (
    <div className="space-y-4">
      <p className="text-lg">{question}</p>
      <div className="space-y-2">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-3 p-4 bg-white/10 rounded-lg cursor-move"
          >
            <div className="w-8 h-8 flex items-center justify-center bg-white/20 rounded-full">
              {index + 1}
            </div>
            {step}
            <div className="flex-1" />
            <button
              onClick={() => moveStep(index, Math.max(0, index - 1))}
              disabled={index === 0}
              className="p-1 hover:bg-white/20 rounded-lg disabled:opacity-50"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
            <button
              onClick={() => moveStep(index, Math.min(steps.length - 1, index + 1))}
              disabled={index === steps.length - 1}
              className="p-1 hover:bg-white/20 rounded-lg disabled:opacity-50"
            >
              <ArrowDown className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </div>
      <button
        onClick={() => onAnswer(steps)}
        className="w-full py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-all duration-300"
      >
        Check Order
      </button>
    </div>
  );
};

export const CodeCorrection: React.FC<QuizTypeProps> = ({ question, code = '', options = [], onAnswer, isCorrect }) => {
  const [selectedError, setSelectedError] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      <p className="text-lg">{question}</p>
      <pre className="bg-black/30 p-4 rounded-lg overflow-x-auto">
        <code>{code}</code>
      </pre>
      <div className="space-y-2">
        {options.map((error, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedError(index)}
            className={`w-full p-4 text-left rounded-lg transition-all duration-300 ${
              selectedError === index ? 'bg-blue-500/20 border-blue-500' : 'bg-white/10'
            } border border-white/20`}
          >
            {error}
          </motion.button>
        ))}
      </div>
      <button
        onClick={() => onAnswer(selectedError)}
        className="w-full py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-all duration-300"
      >
        Submit Answer
      </button>
    </div>
  );
};
