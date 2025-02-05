import { GoogleGenerativeAI } from '@google/generative-ai';

// Safely get API key with fallback
const getApiKey = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('VITE_GEMINI_API_KEY is not configured in environment variables');
  }
  return apiKey;
};

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
  },
  // Add more mock challenges as needed
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
      const apiKey = getApiKey();
      const genAI = new GoogleGenerativeAI(apiKey);
      this.model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      this.useMocks = false;
    } catch (error) {
      console.warn('Falling back to mock data:', error);
      this.useMocks = true;
    }
  }

  async generateDailyChallenge(userLevel: string): Promise<Challenge> {
    if (this.useMocks) {
      // Return a random mock challenge
      const randomIndex = Math.floor(Math.random() * mockChallenges.length);
      return { ...mockChallenges[randomIndex] };
    }

    try {
      const prompt = `
        Generate a coding challenge for a ${userLevel} level programmer.
        Format the response as JSON:
        {
          "title": string,
          "description": string,
          "difficulty": "beginner" | "intermediate" | "advanced",
          "sampleInput": string,
          "sampleOutput": string,
          "testCases": Array<{ input: string, output: string }>,
          "hints": string[],
          "bestSolution": string,
          "concepts": string[]
        }
      `;

      const result = await this.model.generateContent(prompt);
      const responseText = await result.response.text();

      try {
        const response = JSON.parse(responseText);
        return { id: Date.now().toString(), ...response };
      } catch (parseError) {
        console.error('Error parsing challenge response:', parseError, 'Response:', responseText);
        throw new Error('Failed to parse daily challenge response');
      }
    } catch (error) {
      console.error('Error generating challenge:', error);
      // Fallback to a mock challenge on error
      return mockChallenges[0];
    }
  }

  async validateSolution(
    challenge: Challenge,
    userCode: string,
    language: string
  ): Promise<CodeValidationResult> {
    if (this.useMocks) {
      // Simple mock validation
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
        Evaluate this ${language} code solution:
        Problem: ${challenge.description}
        Expected Output: ${challenge.sampleOutput}
        User's Code:
        ${userCode}
        Provide response as JSON:
        {
          "isCorrect": boolean,
          "feedback": string,
          "efficiency": string,
          "readability": string,
          "suggestions": string[]
        }
      `;

      const result = await this.model.generateContent(prompt);
      const responseText = await result.response.text();

      try {
        return JSON.parse(responseText);
      } catch (parseError) {
        console.error('Error parsing validation response:', parseError, 'Response:', responseText);
        throw new Error('Failed to parse solution validation response');
      }
    } catch (error) {
      console.error('Error validating solution:', error);
      // Return a generic response on error
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
        Current Code:
        ${userCode}
        Hint Level:
        ${hintLevel === 1 ? 'Basic clue without code' :
          hintLevel === 2 ? 'More detailed explanation with approach' :
          'Partial solution with code example'}
      `;

      const result = await this.model.generateContent(prompt);
      return await result.response.text();
    } catch (error) {
      console.error('Error getting hint:', error);
      return challenge.hints[hintLevel - 1] || 'Unable to generate hint. Please try again.';
    }
  }
}

export const geminiService = new GeminiService();
