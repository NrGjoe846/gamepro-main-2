import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

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
  private model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  async generateDailyChallenge(userLevel: string): Promise<Challenge> {
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
      throw new Error('Failed to generate daily challenge');
    }
  }

  async validateSolution(
    challenge: Challenge,
    userCode: string,
    language: string
  ): Promise<CodeValidationResult> {
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
      throw new Error('Failed to validate solution');
    }
  }

  async getProgressiveHint(
    challenge: Challenge,
    userCode: string,
    hintLevel: number
  ): Promise<string> {
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
      throw new Error('Failed to generate hint');
    }
  }
}

export const geminiService = new GeminiService();
