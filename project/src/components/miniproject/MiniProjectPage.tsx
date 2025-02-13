import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, Play, Save, Download, Upload, Settings, Copy, Share2, AlertCircle } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import BackButton from '../BackButton';
import CodeEditor from '../CodeEditor/CodeEditor';

const API_KEY = 'AIzaSyCW3F1qklqeJ06T9j_b_ofwoKNdBBsJYws';

interface CodeExplanation {
  line: number;
  explanation: string;
  isError: boolean;
  suggestion?: string;
}

const MiniProjectPage = () => {
  const [code, setCode] = useState('');
  const [explanations, setExplanations] = useState<CodeExplanation[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<'python' | 'javascript' | 'java'>('python');
  const [projectTitle, setProjectTitle] = useState('Untitled Project');
  const [isEditing, setIsEditing] = useState(false);

  // Initialize Gemini AI
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  useEffect(() => {
    const analyzeCode = async () => {
      if (!code.trim()) {
        setExplanations([]);
        return;
      }

      setIsAnalyzing(true);
      try {
        const codeLines = code.split('\n');
        const prompt = `
          Analyze this ${selectedLanguage} code line by line:
          ${code}
          
          For each line, provide:
          1. A brief explanation of what the line does
          2. Whether it contains any errors
          3. Suggestions for improvement if applicable
          
          Format the response as JSON array:
          [
            {
              "line": number,
              "explanation": "explanation text",
              "isError": boolean,
              "suggestion": "improvement suggestion if any"
            }
          ]
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response.text();
        
        try {
          const analysisResult = JSON.parse(response);
          setExplanations(analysisResult);
        } catch (parseError) {
          console.error('Error parsing analysis result:', parseError);
        }
      } catch (error) {
        console.error('Error analyzing code:', error);
      } finally {
        setIsAnalyzing(false);
      }
    };

    // Debounce the analysis to avoid too many API calls
    const timeoutId = setTimeout(analyzeCode, 1000);
    return () => clearTimeout(timeoutId);
  }, [code, selectedLanguage]);

  const handleSave = () => {
    localStorage.setItem('miniproject-code', code);
    localStorage.setItem('miniproject-language', selectedLanguage);
    localStorage.setItem('miniproject-title', projectTitle);
  };

  const handleDownload = () => {
    const fileExtensions = {
      javascript: 'js',
      python: 'py',
      java: 'java'
    };
    
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectTitle}.${fileExtensions[selectedLanguage]}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setCode(content);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] to-[#16213e] text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <BackButton />
            <div className="flex items-center gap-2">
              <Code2 className="w-6 h-6 text-blue-400" />
              {isEditing ? (
                <input
                  type="text"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  onBlur={() => setIsEditing(false)}
                  onKeyDown={(e) => e.key === 'Enter' && setIsEditing(false)}
                  className="bg-transparent border-b border-white/20 focus:border-blue-500 outline-none px-2 py-1"
                  autoFocus
                />
              ) : (
                <h1
                  className="text-2xl font-bold cursor-pointer hover:text-blue-400 transition-colors"
                  onClick={() => setIsEditing(true)}
                >
                  {projectTitle}
                </h1>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value as 'python' | 'javascript' | 'java')}
              className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="python">Python</option>
              <option value="javascript">JavaScript</option>
              <option value="java">Java</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Code Editor */}
          <div className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 overflow-hidden">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code2 className="w-5 h-5 text-blue-400" />
                <span className="font-medium">Code Editor</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSave}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  title="Save"
                >
                  <Save className="w-4 h-4" />
                </button>
                <button
                  onClick={handleDownload}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  title="Download"
                >
                  <Download className="w-4 h-4" />
                </button>
                <label className="p-2 hover:bg-white/10 rounded-lg transition-colors cursor-pointer">
                  <Upload className="w-4 h-4" />
                  <input
                    type="file"
                    onChange={handleUpload}
                    className="hidden"
                    accept=".js,.py,.java"
                  />
                </label>
              </div>
            </div>
            <CodeEditor
              value={code}
              onChange={setCode}
              language={selectedLanguage}
              onSubmit={() => {}}
            />
          </div>

          {/* Real-time Analysis Panel */}
          <div className="space-y-6">
            <div className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Code Analysis</h2>
                {isAnalyzing && (
                  <div className="flex items-center gap-2 text-blue-400">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-b-transparent" />
                    <span className="text-sm">Analyzing...</span>
                  </div>
                )}
              </div>

              <AnimatePresence>
                {explanations.map((exp, index) => (
                  <motion.div
                    key={`${exp.line}-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`p-4 rounded-lg mb-4 ${
                      exp.isError ? 'bg-red-500/20 border-red-500/50' : 'bg-white/5 border-white/10'
                    } border`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-sm font-mono text-gray-400">
                        {exp.line}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm mb-2">{exp.explanation}</p>
                        {exp.isError && (
                          <div className="flex items-center gap-2 text-red-400 text-sm mt-2">
                            <AlertCircle className="w-4 h-4" />
                            <span>{exp.suggestion}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {!isAnalyzing && explanations.length === 0 && (
                <div className="text-center text-gray-400 py-8">
                  Start typing to see code analysis
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiniProjectPage;
