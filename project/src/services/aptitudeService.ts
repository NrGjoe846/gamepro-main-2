import OpenAI from 'openai';

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

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
  private openai;

  constructor() {
    if (!API_KEY) {
      throw new Error('OpenAI API key is not configured');
    }
    
    this.openai = new OpenAI({
      apiKey: API_KEY,
      dangerouslyAllowBrowser: true // Only for development! In production, use a backend proxy
    });
  }

  async generateQuestions(topic: string, count: number = 5): Promise<AptitudeQuestion[]> {
    try {
      const prompt = `Generate ${count} multiple choice questions about ${topic}.
      Each question should be challenging but fair, with 4 options where only one is correct.
      Format as JSON array with properties:
      - id (string)
      - topic (string, matching the input topic)
      - question (string, clear and concise)
      - options (array of 4 strings)
      - correctAnswer (number 0-3)
      - explanation (string explaining why the correct answer is right)
      - difficulty (easy/medium/hard)`;

      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{
          role: "system",
          content: "You are a helpful assistant that generates quiz questions in JSON format."
        }, {
          role: "user",
          content: prompt
        }],
        temperature: 0.7,
        presence_penalty: 0.6,
        frequency_penalty: 0.3
      });

      const text = response.choices[0]?.message?.content?.trim();
      if (!text) {
        throw new Error('No response from OpenAI');
      }

      const questions = text.startsWith('[') ? JSON.parse(text) : [];
      return this.validateQuestions(questions);
    } catch (error) {
      console.error('Error generating questions:', error);
      return this.getFallbackQuestions(topic);
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

  private getFallbackQuestions(topic: string): AptitudeQuestion[] {
    return [{
      id: 'fallback-1',
      topic,
      question: 'This is a sample question about ' + topic,
      options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
      correctAnswer: 0,
      explanation: 'This is a fallback question while the service is unavailable.',
      difficulty: 'medium'
    }];
  }
}

export const aptitudeService = new AptitudeService();
