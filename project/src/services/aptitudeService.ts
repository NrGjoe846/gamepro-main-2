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
    str = str.replace(/```json\n?|\n?```/g, '');
    str = str.replace(/,(\s*[}\]])/g, '$1');
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
        
        Return only the JSON array, no additional text.
      `;

      const result = await this.model.generateContent(prompt);
      const responseText = this.cleanJsonString(await result.response.text());
      
      try {
        const questions = JSON.parse(responseText);
        return this.validateQuestions(questions);
      } catch (parseError) {
        console.error('Error parsing questions:', parseError);
        console.error('Response text:', responseText);
        return this.getFallbackQuestions(topic, count);
      }
    } catch (error) {
      console.error('Error generating questions:', error);
      return this.getFallbackQuestions(topic, count);
    }
  }

  private validateQuestions(questions: any[]): AptitudeQuestion[] {
    return questions.filter(q => 
      q.id && 
      q.topic && 
      q.question && 
      Array.isArray(q.options) && 
      q.options.length === 4 &&
      typeof q.correctAnswer === 'number' &&
      q.correctAnswer >= 0 && 
      q.correctAnswer <= 3 &&
      q.explanation &&
      ['easy', 'medium', 'hard'].includes(q.difficulty)
    );
  }

  private getFallbackQuestions(topic: string, count: number): AptitudeQuestion[] {
    return Array.from({ length: count }, (_, i) => ({
      id: `fallback-${i + 1}`,
      topic,
      question: `Sample question ${i + 1} about ${topic}`,
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correctAnswer: 0,
      explanation: 'This is a mock question while the service is unavailable.',
      difficulty: 'medium' as const
    }));
  }
}

export const aptitudeService = new AptitudeService();
