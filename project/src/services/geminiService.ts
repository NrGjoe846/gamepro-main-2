import { GoogleGenerativeAI } from '@google/generative-ai';

// API key directly implemented
const API_KEY = 'AIzaSyDFujDavmC63MeyvGc9vgchx_HL6vMdjm4';

// Mock challenges for fallback when API is not available
const mockChallenges = [
  {
    id: 'mock-1',
    title: 'Sum of Two Numbers',
    description: 'Write a function that takes two numbers as input and returns their sum.',
    difficulty: 'beginner' as const,
    sampleInput: 'a = 5, b = 3',
    sampleOutput: '8',
    testCases: [
      { input: '2, 3', output: '5' },
      { input: '-1, 1', output: '0' }
    ],
    hints: [
      'Use the + operator to add numbers',
      'Remember to return the result',
      'Consider edge cases like negative numbers'
    ],
    bestSolution: 'def add_numbers(a, b):\n    return a + b',
    concepts: ['Basic arithmetic', 'Function parameters', 'Return values']
  }
];

export interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  sampleInput: string;
  sampleOutput: string;
  testCases: Array<{ input: string; output: string }>;
  hints: string[];
  bestSolution: string;
  concepts: string[];
}

export interface CodeValidationResult {
  isCorrect: boolean;
  feedback: string;
  efficiency: string;
  readability: string;
  suggestions: string[];
}

export class GeminiService {
  private model;
  private useMocks: boolean;

  constructor() {
    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      this.model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      this.useMocks = false;
    } catch (error) {
      console.warn('Falling back to mock data:', error);
      this.useMocks = true;
    }
  }

  private cleanJsonString(str: string): string {
    // Remove markdown code block syntax if present
    str = str.replace(/```json\n?|\n?```/g, '');
    // Remove any trailing commas before closing brackets/braces
    str = str.replace(/,(\s*[}\]])/g, '$1');
    return str.trim();
  }

  async generateDailyChallenge(userLevel: string): Promise<Challenge> {
    if (this.useMocks) {
      const randomIndex = Math.floor(Math.random() * mockChallenges.length);
      return { ...mockChallenges[randomIndex] };
    }

    try {
      const prompt = `
        Generate a coding challenge for a ${userLevel} level programmer.
        The response must be valid JSON with the following structure:
        {
          "title": "short title",
          "description": "clear description under 100 words",
          "difficulty": "${userLevel}",
          "sampleInput": "brief example input",
          "sampleOutput": "expected output",
          "testCases": [
            { "input": "test input 1", "output": "expected output 1" },
            { "input": "test input 2", "output": "expected output 2" }
          ],
          "hints": ["hint 1", "hint 2", "hint 3"],
          "bestSolution": "code solution",
          "concepts": ["concept 1", "concept 2"]
        }
        Keep all strings concise and ensure valid JSON format.
      `;

      const result = await this.model.generateContent(prompt);
      const responseText = this.cleanJsonString(await result.response.text());

      try {
        const response = JSON.parse(responseText);
        return { 
          id: Date.now().toString(),
          ...response,
          difficulty: userLevel as 'beginner' | 'intermediate' | 'advanced'
        };
      } catch (parseError) {
        console.error('Error parsing challenge response:', parseError);
        console.error('Response text:', responseText);
        return mockChallenges[0];
      }
    } catch (error) {
      console.error('Error generating challenge:', error);
      return mockChallenges[0];
    }
  }

  async validateSolution(
    challenge: Challenge,
    userCode: string,
    language: string
  ): Promise<CodeValidationResult> {
    if (this.useMocks) {
      return {
        isCorrect: userCode.includes('return') && userCode.includes('+'),
        feedback: 'Good attempt!',
        efficiency: 'Good',
        readability: 'Clear',
        suggestions: ['Consider adding comments']
      };
    }

    try {
      const prompt = `
        Evaluate this ${language} code solution.
        Problem: ${challenge.description}
        Expected Output: ${challenge.sampleOutput}
        User's Code: ${userCode}
        
        Respond with valid JSON in this exact format:
        {
          "isCorrect": true/false,
          "feedback": "specific feedback",
          "efficiency": "efficiency rating",
          "readability": "readability rating",
          "suggestions": ["suggestion 1", "suggestion 2"]
        }
      `;

      const result = await this.model.generateContent(prompt);
      const responseText = this.cleanJsonString(await result.response.text());

      try {
        return JSON.parse(responseText);
      } catch (parseError) {
        console.error('Error parsing validation response:', parseError);
        return {
          isCorrect: false,
          feedback: 'Error validating solution',
          efficiency: 'N/A',
          readability: 'N/A',
          suggestions: ['Please try again']
        };
      }
    } catch (error) {
      console.error('Error validating solution:', error);
      return {
        isCorrect: false,
        feedback: 'Unable to validate solution. Please try again.',
        efficiency: 'N/A',
        readability: 'N/A',
        suggestions: ['Check your code and try again']
      };
    }
  }

  async getProgressiveHint(
    challenge: Challenge,
    userCode: string,
    hintLevel: number
  ): Promise<string> {
    if (this.useMocks) {
      return challenge.hints[hintLevel - 1] || 'No more hints available';
    }

    try {
      const prompt = `
        Provide a level ${hintLevel} hint for this coding challenge:
        Problem: ${challenge.description}
        Current Code: ${userCode}
        Hint Level: ${
          hintLevel === 1 ? 'Basic clue without code' :
          hintLevel === 2 ? 'More detailed explanation with approach' :
          'Partial solution with code example'
        }
        
        Respond with a single concise hint string.
      `;

      const result = await this.model.generateContent(prompt);
      const hint = await result.response.text();
      return hint.replace(/^["']|["']$/g, '').trim();
    } catch (error) {
      console.error('Error getting hint:', error);
      return challenge.hints[hintLevel - 1] || 'Unable to generate hint. Please try again.';
    }
  }
}

export const geminiService = new GeminiService();
