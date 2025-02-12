import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = 'AIzaSyDFujDavmC63MeyvGc9vgchx_HL6vMdjm4';

export interface AptitudeQuestion {
  id: string;
  topic: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface TopicScore {
  topic: string;
  score: number;
  totalQuestions: number;
  completedQuestions: string[];
}

class AptitudeService {
  private model;
  private useMocks = false;

  constructor() {
    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      this.model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    } catch (error) {
      console.warn('Failed to initialize Gemini client, falling back to mock data:', error);
      this.useMocks = true;
    }
  }

  private cleanJsonString(str: string): string {
    // Remove markdown code blocks
    str = str.replace(/```json\n?|\n?```/g, '');
    // Remove trailing commas
    str = str.replace(/,(\s*[}\]])/g, '$1');
    // Remove any non-JSON text before or after
    const jsonStart = str.indexOf('[');
    const jsonEnd = str.lastIndexOf(']') + 1;
    if (jsonStart >= 0 && jsonEnd > jsonStart) {
      str = str.slice(jsonStart, jsonEnd);
    }
    return str.trim();
  }

  async generateQuestions(topic: string, count: number = 5): Promise<AptitudeQuestion[]> {
    if (this.useMocks) {
      return this.getFallbackQuestions(topic, count);
    }

    try {
      const prompt = `
        Generate ${count} multiple choice questions about ${topic}.
        Each question should be challenging but fair, with 4 options where only one is correct.
        
        Format the response as a JSON array of questions with the following structure:
        [
          {
            "id": "unique-string",
            "topic": "${topic}",
            "question": "clear and concise question",
            "options": ["option1", "option2", "option3", "option4"],
            "correctAnswer": 0,
            "explanation": "detailed explanation of the correct answer",
            "difficulty": "medium"
          }
        ]

        Requirements:
        1. Questions should be diverse and cover different aspects of ${topic}
        2. All options should be plausible but only one correct
        3. Explanations should be educational and clear
        4. Difficulty should be one of: "easy", "medium", "hard"
        5. correctAnswer should be the index (0-3) of the correct option
        6. Questions should be specific to ${topic} and test real knowledge
        7. Include practical, real-world examples where applicable
        8. Ensure questions are progressively challenging
        9. Mix theoretical and practical questions
        10. Include both conceptual and calculation-based questions if relevant
        
        Return only the JSON array, no additional text.
      `;

      const result = await this.model.generateContent(prompt);
      const responseText = result.response.text();
      
      if (!responseText) {
        console.error('Empty response from API');
        return this.getFallbackQuestions(topic, count);
      }

      const cleanedJson = this.cleanJsonString(responseText);
      
      try {
        const questions = JSON.parse(cleanedJson);
        if (!Array.isArray(questions) || questions.length === 0) {
          console.error('Invalid questions array:', questions);
          return this.getFallbackQuestions(topic, count);
        }

        const validatedQuestions = this.validateQuestions(questions);
        if (validatedQuestions.length === 0) {
          console.error('No valid questions after validation');
          return this.getFallbackQuestions(topic, count);
        }

        return validatedQuestions;
      } catch (parseError) {
        console.error('Error parsing questions:', parseError);
        console.error('Cleaned response text:', cleanedJson);
        return this.getFallbackQuestions(topic, count);
      }
    } catch (error) {
      console.error('Error generating questions:', error);
      return this.getFallbackQuestions(topic, count);
    }
  }

  private validateQuestions(questions: any[]): AptitudeQuestion[] {
    return questions.filter(q => {
      try {
        return (
          q.id && 
          typeof q.id === 'string' &&
          q.topic && 
          typeof q.topic === 'string' &&
          q.question && 
          typeof q.question === 'string' &&
          Array.isArray(q.options) && 
          q.options.length === 4 &&
          q.options.every(opt => typeof opt === 'string') &&
          typeof q.correctAnswer === 'number' &&
          q.correctAnswer >= 0 && 
          q.correctAnswer <= 3 &&
          q.explanation &&
          typeof q.explanation === 'string' &&
          q.difficulty &&
          ['easy', 'medium', 'hard'].includes(q.difficulty)
        );
      } catch (error) {
        console.error('Error validating question:', error);
        return false;
      }
    }).map(q => ({
      ...q,
      id: q.id.replace(/[^a-zA-Z0-9-]/g, '-'),
      options: q.options.map(String),
      explanation: String(q.explanation)
    }));
  }

  private getFallbackQuestions(topic: string, count: number): AptitudeQuestion[] {
    const difficulties: ('easy' | 'medium' | 'hard')[] = ['easy', 'medium', 'hard'];
    
    return Array.from({ length: count }, (_, i) => ({
      id: `fallback-${i + 1}`,
      topic,
      question: `Sample question ${i + 1} about ${topic}: What is the most important concept to understand in ${topic}?`,
      options: [
        'Understanding core principles',
        'Memorizing formulas',
        'Taking notes',
        'Reading textbooks'
      ],
      correctAnswer: 0,
      explanation: `Understanding core principles is essential in ${topic} as it forms the foundation for more advanced concepts.`,
      difficulty: difficulties[i % difficulties.length]
    }));
  }

  async getTopicHints(topic: string): Promise<string[]> {
    if (this.useMocks) {
      return [
        'Review basic concepts',
        'Practice with examples',
        'Focus on key formulas'
      ];
    }

    try {
      const prompt = `
        Generate 3 helpful study hints for the topic: ${topic}
        Format as a JSON array of strings.
        Make hints specific, actionable, and focused on key concepts.
      `;

      const result = await this.model.generateContent(prompt);
      const responseText = result.response.text();
      
      if (!responseText) {
        return this.getFallbackHints();
      }

      const cleanedJson = this.cleanJsonString(responseText);
      
      try {
        const hints = JSON.parse(cleanedJson);
        if (!Array.isArray(hints) || hints.length === 0) {
          return this.getFallbackHints();
        }
        return hints.map(String);
      } catch {
        return this.getFallbackHints();
      }
    } catch (error) {
      console.error('Error generating hints:', error);
      return this.getFallbackHints();
    }
  }

  private getFallbackHints(): string[] {
    return [
      'Review the fundamental concepts',
      'Practice with sample problems',
      'Focus on understanding rather than memorizing'
    ];
  }
}

export const aptitudeService = new AptitudeService();
