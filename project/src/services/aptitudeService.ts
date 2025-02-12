import { Configuration, OpenAIApi } from 'openai';

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
    const configuration = new Configuration({
      apiKey: API_KEY
    });
    this.openai = new OpenAIApi(configuration);
  }

  async generateQuestions(topic: string, count: number = 5): Promise<AptitudeQuestion[]> {
    try {
      const prompt = `Generate ${count} multiple choice questions about ${topic}.
      Format as JSON array with properties:
      - id (string)
      - topic (string)
      - question (string)
      - options (array of 4 strings)
      - correctAnswer (number 0-3)
      - explanation (string)
      - difficulty (easy/medium/hard)`;

      const response = await this.openai.createCompletion({
        model: "text-davinci-003",
        prompt,
        max_tokens: 1000,
        temperature: 0.7
      });

      const text = response.data.choices[0]?.text?.trim();
      const questions = text && text.startsWith('[') ? JSON.parse(text) : [];
      return questions;
    } catch (error) {
      console.error('Error generating questions:', error);
      return [];
    }
  }
}

export const aptitudeService = new AptitudeService();
