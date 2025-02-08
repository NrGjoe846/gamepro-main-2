import { Challenge } from '../types/challenges';

const DIFFICULTY_WEIGHTS = {
  beginner: { complexity: 1, hints: 5 },
  intermediate: { complexity: 2, hints: 4 },
  advanced: { complexity: 3, hints: 3 }
};

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
  performanceScore?: number;
  codeQualityScore?: number;
  executionTime?: string;
  memoryUsage?: string;
  testCasesPassed?: number;
  totalTestCases?: number;
  detailedResults?: Array<{
    testCase: string;
    expected: string;
    actual: string;
    passed: boolean;
  }>;
}

export class DeepSeekService {
  private model;
  private useMocks: boolean;
  private hintCache: Map<string, string[]>;

  constructor() {
    try {
      // Initialize DeepSeek model
      this.initializeDeepSeekModel();
      this.useMocks = false;
      this.hintCache = new Map();
    } catch (error) {
      console.warn('Falling back to mock data:', error);
      this.useMocks = true;
    }
  }

  private async initializeDeepSeekModel() {
    try {
      const response = await fetch('/api/deepseek/init', {
        method: 'POST'
      });
      if (!response.ok) {
        throw new Error('Failed to initialize DeepSeek model');
      }
    } catch (error) {
      console.error('Error initializing DeepSeek model:', error);
      this.useMocks = true;
    }
  }

  private async generateDeepSeekResponse(prompt: string): Promise<string> {
    try {
      const response = await fetch('/api/deepseek/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt })
      });

      if (!response.ok) {
        throw new Error('Failed to generate response');
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Error generating DeepSeek response:', error);
      throw error;
    }
  }

  private cleanJsonString(str: string): string {
    str = str.replace(/```json\n?|\n?```/g, '');
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

      const responseText = await this.generateDeepSeekResponse(prompt);
      const cleanedResponse = this.cleanJsonString(responseText);

      try {
        const response = JSON.parse(cleanedResponse);
        return { 
          id: Date.now().toString(),
          ...response,
          difficulty: userLevel as 'beginner' | 'intermediate' | 'advanced'
        };
      } catch (parseError) {
        console.error('Error parsing challenge response:', parseError);
        console.error('Response text:', cleanedResponse);
        return mockChallenges[0];
      }
    } catch (error) {
      console.error('Error generating challenge:', error);
      return mockChallenges[0];
    }
  }

  private async validateTestCases(code: string, testCases: Array<{ input: string; output: string }>, language: string): Promise<boolean> {
    try {
      const prompt = `
        Validate if this ${language} code passes all test cases:
        Code: ${code}
        Test Cases: ${JSON.stringify(testCases)}
        
        Return only true or false.
      `;

      const response = await this.generateDeepSeekResponse(prompt);
      return response.toLowerCase().includes('true');
    } catch (error) {
      console.error('Error validating test cases:', error);
      return false;
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
        efficiency: 'O(1)',
        readability: 'Good',
        suggestions: ['Consider adding comments'],
        performanceScore: 85,
        codeQualityScore: 80
      };
    }

    try {
      const testCasesPassed = await this.validateTestCases(userCode, challenge.testCases, language);
      
      const prompt = `
        Thoroughly evaluate this ${language} solution:
        Problem: ${challenge.description}
        Expected Output: ${challenge.sampleOutput}
        User's Code: ${userCode}
        Test Cases: ${JSON.stringify(challenge.testCases)}
        Test Cases Passed: ${testCasesPassed}

        Provide a comprehensive analysis including:
        1. Code correctness
        2. Time complexity
        3. Space complexity
        4. Code style and readability
        5. Potential optimizations
        6. Edge cases handling
        7. Best practices followed/violated

        Response must be valid JSON with:
        {
          "isCorrect": ${testCasesPassed},
          "feedback": "detailed explanation",
          "efficiency": "Big O analysis",
          "readability": "code style evaluation",
          "suggestions": ["improvement 1", "improvement 2"],
          "executionTime": "estimated runtime",
          "memoryUsage": "estimated space usage",
          "testCasesPassed": ${testCasesPassed ? challenge.testCases.length : 0},
          "totalTestCases": ${challenge.testCases.length},
          "detailedResults": [
            {
              "testCase": "input value",
              "expected": "expected output",
              "actual": "actual output",
              "passed": boolean
            }
          ]
        }
      `;

      const responseText = await this.generateDeepSeekResponse(prompt);
      const cleanedResponse = this.cleanJsonString(responseText);
      const validation = JSON.parse(cleanedResponse);

      return {
        ...validation,
        performanceScore: this.calculatePerformanceScore(validation),
        codeQualityScore: this.calculateCodeQualityScore(validation)
      };
    } catch (error) {
      console.error('Error validating solution:', error);
      return this.getFallbackValidation();
    }
  }

  private calculatePerformanceScore(validation: CodeValidationResult): number {
    const testCaseScore = (validation.testCasesPassed || 0) / (validation.totalTestCases || 1) * 100;
    const efficiencyScore = this.getEfficiencyScore(validation.efficiency);
    return Math.round((testCaseScore + efficiencyScore) / 2);
  }

  private calculateCodeQualityScore(validation: CodeValidationResult): number {
    const readabilityScore = this.getReadabilityScore(validation.readability);
    const bestPracticesScore = validation.suggestions.length > 0 ? 100 - (validation.suggestions.length * 10) : 100;
    return Math.round((readabilityScore + bestPracticesScore) / 2);
  }

  private getEfficiencyScore(efficiency: string): number {
    if (efficiency.includes('O(1)')) return 100;
    if (efficiency.includes('O(log n)')) return 90;
    if (efficiency.includes('O(n)')) return 80;
    if (efficiency.includes('O(n log n)')) return 70;
    if (efficiency.includes('O(n^2)')) return 60;
    return 50;
  }

  private getReadabilityScore(readability: string): number {
    const readabilityLower = readability.toLowerCase();
    if (readabilityLower.includes('excellent')) return 100;
    if (readabilityLower.includes('good')) return 80;
    if (readabilityLower.includes('fair')) return 60;
    if (readabilityLower.includes('poor')) return 40;
    return 50;
  }

  async getInfiniteHints(
    challenge: Challenge,
    userCode: string,
    previousHints: string[]
  ): Promise<string> {
    if (this.useMocks) {
      const fallbackHint = this.getFallbackHint(previousHints.length);
      const cacheKey = challenge.id;
      const existingHints = this.hintCache.get(cacheKey) || [];
      this.hintCache.set(cacheKey, [...existingHints, fallbackHint]);
      return fallbackHint;
    }

    try {
      const difficultyWeight = DIFFICULTY_WEIGHTS[challenge.difficulty];
      const hintLevel = previousHints.length + 1;
      const revealLevel = (hintLevel / difficultyWeight.hints) * 100;

      const prompt = `
        Generate hint #${hintLevel} for this coding challenge:
        Problem: ${challenge.description}
        Current Code: ${userCode}
        Previous Hints: ${JSON.stringify(previousHints)}
        Reveal Level: ${revealLevel}%
        
        Rules for hint generation:
        1. Never repeat previous hints
        2. Progressively reveal more solution details based on reveal level
        3. At ${revealLevel}% reveal level, provide ${
          revealLevel < 30 ? 'conceptual guidance' :
          revealLevel < 60 ? 'algorithmic approach' :
          revealLevel < 90 ? 'partial implementation details' :
          'specific implementation guidance'
        }
        4. Keep hints engaging and educational
        5. For difficulty ${challenge.difficulty}, adjust complexity accordingly
        
        Respond with a single clear hint string.
      `;

      const hint = await this.generateDeepSeekResponse(prompt);
      
      const cacheKey = challenge.id;
      const existingHints = this.hintCache.get(cacheKey) || [];
      this.hintCache.set(cacheKey, [...existingHints, hint]);
      
      return hint.trim();
    } catch (error) {
      console.error('Error generating hint:', error);
      return this.getFallbackHint(previousHints.length + 1);
    }
  }

  private getFallbackValidation(): CodeValidationResult {
    return {
      isCorrect: false,
      feedback: 'Unable to validate solution. Please try again.',
      efficiency: 'N/A',
      readability: 'N/A',
      suggestions: ['Check your code and try again'],
      performanceScore: 0,
      codeQualityScore: 0
    };
  }

  private getFallbackHint(hintLevel: number): string {
    const fallbackHints = [
      "Try breaking down the problem into smaller steps.",
      "Think about edge cases in your solution.",
      "Consider optimizing your current approach.",
      "Look for patterns in the problem.",
      "Think about the time complexity of your solution."
    ];
    return fallbackHints[hintLevel % fallbackHints.length];
  }
}

export const deepseekService = new DeepSeekService();
