import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, Play, ArrowRight, ArrowLeft, AlertCircle, RefreshCw } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import BackButton from '../BackButton';
import CodeEditor from '../CodeEditor/CodeEditor';

const API_KEY = 'AIzaSyCW3F1qklqeJ06T9j_b_ofwoKNdBBsJYws';

const TODO_LIST_CODE = `# Simple To-Do List Application

# Dictionary to store tasks with a status (Pending/Done)
tasks = {}

# Function to display the menu
def display_menu():
    print("\\n--- To-Do List Menu ---")
    print("1. Add Task")
    print("2. View Tasks")
    print("3. Mark Task as Done")
    print("4. Delete Task")
    print("5. Exit")

# Function to add a new task
def add_task():
    task_name = input("Enter the task: ")
    if task_name in tasks:
        print("Task already exists!")
    else:
        tasks[task_name] = "Pending"
        print(f"Task '{task_name}' added successfully!")

# Function to view all tasks
def view_tasks():
    if not tasks:
        print("No tasks available.")
    else:
        print("\\n--- Task List ---")
        for i, (task, status) in enumerate(tasks.items(), start=1):
            print(f"{i}. {task} - {status}")

# Function to mark a task as done
def mark_task_done():
    task_name = input("Enter the task to mark as done: ")
    if task_name in tasks:
        tasks[task_name] = "Done"
        print(f"Task '{task_name}' marked as done!")
    else:
        print("Task not found!")

# Function to delete a task
def delete_task():
    task_name = input("Enter the task to delete: ")
    if task_name in tasks:
        del tasks[task_name]
        print(f"Task '{task_name}' deleted successfully!")
    else:
        print("Task not found!")

# Main function to run the To-Do List application
def main():
    while True:
        display_menu()
        choice = input("Choose an option (1-5): ")
        if choice == "1":
            add_task()
        elif choice == "2":
            view_tasks()
        elif choice == "3":
            mark_task_done()
        elif choice == "4":
            delete_task()
        elif choice == "5":
            print("Exiting To-Do List. Goodbye!")
            break
        else:
            print("Invalid choice! Please choose a valid option.")

# Run the application
if __name__ == "__main__":
    main()`;

interface CodeLine {
  code: string;
  explanation: string;
  isLoading?: boolean;
  error?: string;
}

const MiniProjectPage = () => {
  const [codeLines, setCodeLines] = useState<CodeLine[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [isExplanationLoading, setIsExplanationLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize Gemini AI
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  useEffect(() => {
    // Split code into lines and initialize with empty explanations
    const lines = TODO_LIST_CODE.split('\n').map(line => ({
      code: line,
      explanation: '',
      isLoading: false
    }));
    setCodeLines(lines);
    fetchExplanation(0, lines[0].code);
  }, []);

  const fetchExplanation = async (lineIndex: number, code: string) => {
    if (!code.trim() || code.trim().startsWith('#')) {
      // Skip empty lines or comments
      setCodeLines(prev => {
        const newLines = [...prev];
        newLines[lineIndex] = {
          ...newLines[lineIndex],
          explanation: code.trim().startsWith('#') ? code.trim().substring(1).trim() : '',
          isLoading: false
        };
        return newLines;
      });
      return;
    }

    setIsExplanationLoading(true);
    setCodeLines(prev => {
      const newLines = [...prev];
      newLines[lineIndex] = { ...newLines[lineIndex], isLoading: true };
      return newLines;
    });

    try {
      const prompt = `
        Explain this line of Python code in simple terms:
        ${code}
        
        Provide a clear, concise explanation that a beginner would understand.
        Focus on:
        1. What the line does
        2. Why it's important
        3. How it fits in the context of a To-Do List application
        
        Keep the explanation under 100 words.
      `;

      const result = await model.generateContent(prompt);
      const explanation = await result.response.text();

      setCodeLines(prev => {
        const newLines = [...prev];
        newLines[lineIndex] = {
          ...newLines[lineIndex],
          explanation: explanation.trim(),
          isLoading: false
        };
        return newLines;
      });
    } catch (error) {
      console.error('Error fetching explanation:', error);
      setError('Failed to fetch explanation. Please try again.');
      setCodeLines(prev => {
        const newLines = [...prev];
        newLines[lineIndex] = {
          ...newLines[lineIndex],
          error: 'Failed to fetch explanation',
          isLoading: false
        };
        return newLines;
      });
    } finally {
      setIsExplanationLoading(false);
    }
  };

  const handleNext = () => {
    if (currentLineIndex < codeLines.length - 1) {
      const nextIndex = currentLineIndex + 1;
      setCurrentLineIndex(nextIndex);
      if (!codeLines[nextIndex].explanation) {
        fetchExplanation(nextIndex, codeLines[nextIndex].code);
      }
    }
  };

  const handlePrevious = () => {
    if (currentLineIndex > 0) {
      setCurrentLineIndex(prev => prev - 1);
    }
  };

  const handleRetry = () => {
    setError(null);
    fetchExplanation(currentLineIndex, codeLines[currentLineIndex].code);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] to-[#16213e] text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <BackButton />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Code Display Panel */}
          <div className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 overflow-hidden">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code2 className="w-5 h-5 text-blue-400" />
                <span className="font-medium">Python To-Do List Application</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">
                  Line {currentLineIndex + 1} of {codeLines.length}
                </span>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-black/20" />
              <div className="p-4 font-mono text-sm overflow-x-auto">
                {codeLines.slice(0, currentLineIndex + 1).map((line, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`whitespace-pre ${
                      index === currentLineIndex ? 'bg-blue-500/20 -mx-4 px-4' : ''
                    }`}
                  >
                    {line.code}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Explanation Panel */}
          <div className="space-y-6">
            <div className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 p-6">
              <h2 className="text-xl font-bold mb-4">Code Explanation</h2>
              
              <AnimatePresence mode="wait">
                {isExplanationLoading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-3 text-blue-400"
                  >
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Generating explanation...</span>
                  </motion.div>
                ) : error ? (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="bg-red-500/20 p-4 rounded-lg"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="w-5 h-5 text-red-400" />
                      <span>{error}</span>
                    </div>
                    <button
                      onClick={handleRetry}
                      className="text-sm text-blue-400 hover:text-blue-300"
                    >
                      Try again
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="explanation"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="prose prose-invert max-w-none"
                  >
                    {codeLines[currentLineIndex]?.explanation || 
                     "This line is part of the Python To-Do List application structure."}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex justify-between mt-6">
                <button
                  onClick={handlePrevious}
                  disabled={currentLineIndex === 0}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Previous
                </button>
                <button
                  onClick={handleNext}
                  disabled={currentLineIndex === codeLines.length - 1}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Progress Indicator */}
            <div className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 p-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-400">Progress</span>
                <span className="text-sm text-gray-400">
                  {Math.round((currentLineIndex / (codeLines.length - 1)) * 100)}%
                </span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                  style={{
                    width: `${(currentLineIndex / (codeLines.length - 1)) * 100}%`
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiniProjectPage;
