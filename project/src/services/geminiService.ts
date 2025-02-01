import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI('AIzaSyDFujDavmC63MeyvGc9vgchx_HL6vMdjm4');

export interface CodeValidationResult {
  isCorrect: boolean;
  feedback: string;
  hint?: string;
  explanation?: string;
}

export class GeminiService {
  private model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  async validateCode(
    code: string,
    expectedOutput: string,
    language: string,
    context: string
  ): Promise<CodeValidationResult> {
    try {
      const prompt = `
        As a coding instructor, evaluate this ${language} code:
        
        Context: ${context}
        Expected Output: ${expectedOutput}
        
        Student's Code:
        ${code}
        
        Provide a JSON response with:
        1. isCorrect (boolean): Whether the code produces the expected output
        2. feedback (string): Specific feedback about the code
        3. hint (string): A helpful hint if the code is incorrect
        4. explanation (string): Detailed explanation of the correct approach
        
        Format: {"isCorrect": boolean, "feedback": "string", "hint": "string", "explanation": "string"}
      `;

      const result = await this.model.generateContent(prompt);
      const response = result.response;
      const text = response.text();
      
      try {
        return JSON.parse(text) as CodeValidationResult;
      } catch (e) {
        // If JSON parsing fails, extract information from text
        return {
          isCorrect: text.toLowerCase().includes('correct'),
          feedback: text,
          hint: text.includes('Hint:') ? text.split('Hint:')[1].split('\n')[0].trim() : undefined,
          explanation: text.includes('Explanation:') ? text.split('Explanation:')[1].trim() : undefined
        };
      }
    } catch (error) {
      console.error('Gemini API Error:', error);
      return {
        isCorrect: false,
        feedback: 'Error validating code. Please try again.',
        hint: 'Check your syntax and try again.',
      };
    }
  }

  async getHint(question: string, currentCode: string, language: string): Promise<string> {
    try {
      const prompt = `
        As a coding instructor, provide a helpful hint for this ${language} problem:
        
        Problem: ${question}
        Current Code:
        ${currentCode}
        
        Provide a concise, specific hint that guides the student without giving away the complete solution.
      `;

      const result = await this.model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error('Gemini API Error:', error);
      return 'Unable to generate hint at the moment. Please try again.';
    }
  }

  async explainCode(code: string, language: string): Promise<string> {
    try {
      const prompt = `
        Explain this ${language} code in a clear and concise way:
        
        ${code}
        
        Focus on:
        1. What the code does
        2. Key concepts used
        3. Potential improvements
      `;

      const result = await this.model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error('Gemini API Error:', error);
      return 'Unable to explain code at the moment. Please try again.';
    }
  }
}

export const geminiService = new GeminiService();
