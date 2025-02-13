import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = 'AIzaSyDFujDavmC63MeyvGc9vgchx_HL6vMdjm4';

export class InterviewService {
  private model;

  constructor() {
    const genAI = new GoogleGenerativeAI(API_KEY);
    this.model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  }

  async generateQuestion(category: string, difficulty: string, previousQuestions: string[] = []): Promise<string> {
    try {
      const prompt = `
        Generate an interview question for the ${category} category at ${difficulty} level.
        The question should:
        1. Be specific and technical
        2. Test deep understanding
        3. Be different from these previous questions: ${previousQuestions.join(', ')}
        4. Be suitable for a technical interview
        
        Return only the question text, no additional formatting.
      `;

      const result = await this.model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error('Error generating question:', error);
      return this.getFallbackQuestion(category, difficulty);
    }
  }

  async analyzeResponse(response: string, question: string, category: string): Promise<{
    score: number;
    feedback: string;
    suggestions: string[];
    detailedAnalysis: string;
  }> {
    try {
      const prompt = `
        Analyze this interview response for a ${category} position:
        Question: ${question}
        Response: ${response}

        Provide analysis in JSON format:
        {
          "score": number between 0-100,
          "feedback": "brief overall feedback",
          "suggestions": ["improvement suggestion 1", "improvement suggestion 2"],
          "detailedAnalysis": "detailed breakdown of strengths and weaknesses"
        }
      `;

      const result = await this.model.generateContent(prompt);
      const analysis = JSON.parse(result.response.text());
      return analysis;
    } catch (error) {
      console.error('Error analyzing response:', error);
      return {
        score: 50,
        feedback: "Unable to analyze response. Please try again.",
        suggestions: ["Provide more detailed answers", "Include specific examples"],
        detailedAnalysis: "Analysis unavailable"
      };
    }
  }

  async generateFollowUpQuestion(category: string, difficulty: string, context: {
    previousQuestion: string;
    response: string;
  }): Promise<string> {
    try {
      const prompt = `
        Generate a follow-up interview question based on this context:
        Category: ${category}
        Difficulty: ${difficulty}
        Previous Question: ${context.previousQuestion}
        Candidate's Response: ${context.response}

        The follow-up should:
        1. Build on the previous response
        2. Probe deeper into the topic
        3. Test understanding of related concepts
        4. Be at the same difficulty level

        Return only the follow-up question text.
      `;

      const result = await this.model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error('Error generating follow-up:', error);
      return "Could you elaborate more on your previous answer?";
    }
  }

  private getFallbackQuestion(category: string, difficulty: string): string {
    const fallbackQuestions = {
      'data-science': 'Explain the difference between supervised and unsupervised learning.',
      'machine-learning': 'What is gradient descent and how does it work?',
      'python': 'Explain decorators in Python.',
      'sql': 'Describe the different types of JOIN operations.',
      'default': 'Tell me about your experience with this technology.'
    };

    return fallbackQuestions[category] || fallbackQuestions.default;
  }
}

export const interviewService = new InterviewService();
