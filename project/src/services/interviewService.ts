import { categories } from '../data/interviewQuestions';

// Mock interview questions for each category
const mockQuestions = {
  'data-science': [
    {
      id: 'ds-1',
      question: 'Explain the difference between supervised and unsupervised learning.',
      expectedTopics: ['Classification', 'Clustering', 'Labeled data', 'Unlabeled data'],
      difficulty: 'beginner'
    },
    {
      id: 'ds-2',
      question: 'What is the curse of dimensionality?',
      expectedTopics: ['High dimensions', 'Feature space', 'Data sparsity'],
      difficulty: 'intermediate'
    }
  ],
  'machine-learning': [
    {
      id: 'ml-1',
      question: 'Explain how decision trees work.',
      expectedTopics: ['Node splitting', 'Information gain', 'Tree pruning'],
      difficulty: 'beginner'
    },
    {
      id: 'ml-2',
      question: 'What is gradient descent and how does it work?',
      expectedTopics: ['Optimization', 'Learning rate', 'Cost function'],
      difficulty: 'intermediate'
    }
  ],
  'deep-learning': [
    {
      id: 'dl-1',
      question: 'What are neural networks and how do they work?',
      expectedTopics: ['Neurons', 'Activation functions', 'Backpropagation'],
      difficulty: 'beginner'
    },
    {
      id: 'dl-2',
      question: 'Explain the vanishing gradient problem.',
      expectedTopics: ['Gradient descent', 'Deep networks', 'ReLU'],
      difficulty: 'advanced'
    }
  ],
  'statistics': [
    {
      id: 'st-1',
      question: 'What is the difference between population and sample?',
      expectedTopics: ['Data collection', 'Sampling methods', 'Bias'],
      difficulty: 'beginner'
    },
    {
      id: 'st-2',
      question: 'Explain the Central Limit Theorem.',
      expectedTopics: ['Normal distribution', 'Sample means', 'Standard error'],
      difficulty: 'intermediate'
    }
  ],
  'python': [
    {
      id: 'py-1',
      question: 'What are the key features of Python?',
      expectedTopics: ['Dynamic typing', 'Interpreted', 'Object-oriented'],
      difficulty: 'beginner'
    },
    {
      id: 'py-2',
      question: 'Explain decorators in Python.',
      expectedTopics: ['Function wrappers', 'Metaprogramming', '@syntax'],
      difficulty: 'advanced'
    }
  ],
  'sql': [
    {
      id: 'sql-1',
      question: 'What are the different types of JOINs in SQL?',
      expectedTopics: ['INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL JOIN'],
      difficulty: 'beginner'
    },
    {
      id: 'sql-2',
      question: 'Explain window functions in SQL.',
      expectedTopics: ['OVER clause', 'Partitioning', 'ROW_NUMBER'],
      difficulty: 'advanced'
    }
  ]
};

// Mock feedback responses
const feedbackTemplates = {
  excellent: [
    "Excellent answer! You demonstrated comprehensive knowledge of {topic}.",
    "Outstanding response! Your explanation of {topic} was very thorough.",
    "Great job! You covered all the key aspects of {topic}."
  ],
  good: [
    "Good answer! You understood the main concepts of {topic}.",
    "Well done! Your explanation of {topic} was clear.",
    "Nice work! You showed good knowledge of {topic}."
  ],
  fair: [
    "Fair answer. Consider elaborating more on {topic}.",
    "Decent response, but you could expand on {topic}.",
    "Good start, but try to include more details about {topic}."
  ],
  needsImprovement: [
    "Your answer needs more detail about {topic}.",
    "Try to focus more on the key concepts of {topic}.",
    "Review the fundamentals of {topic} and try again."
  ]
};

export class InterviewService {
  getQuestionsForCategory(category: string, difficulty: string) {
    return mockQuestions[category]?.filter(q => q.difficulty === difficulty) || [];
  }

  analyzeResponse(response: string, question: any): {
    score: number;
    feedback: string;
    detailedFeedback: string[];
  } {
    // Simple keyword-based analysis
    const keywords = question.expectedTopics;
    const responseWords = response.toLowerCase().split(' ');
    
    let matchedKeywords = 0;
    keywords.forEach(keyword => {
      if (responseWords.some(word => word.includes(keyword.toLowerCase()))) {
        matchedKeywords++;
      }
    });

    const coverage = matchedKeywords / keywords.length;
    const score = Math.round(coverage * 100);

    // Generate feedback
    let feedbackType: keyof typeof feedbackTemplates;
    if (score >= 90) feedbackType = 'excellent';
    else if (score >= 70) feedbackType = 'good';
    else if (score >= 50) feedbackType = 'fair';
    else feedbackType = 'needsImprovement';

    const feedback = this.getRandomFeedback(feedbackType, question.topic);

    // Generate detailed feedback
    const detailedFeedback = this.generateDetailedFeedback(keywords, responseWords);

    return {
      score,
      feedback,
      detailedFeedback
    };
  }

  private getRandomFeedback(type: keyof typeof feedbackTemplates, topic: string): string {
    const templates = feedbackTemplates[type];
    const template = templates[Math.floor(Math.random() * templates.length)];
    return template.replace('{topic}', topic);
  }

  private generateDetailedFeedback(expectedKeywords: string[], responseWords: string[]): string[] {
    const feedback: string[] = [];
    
    // Check covered topics
    const coveredKeywords = expectedKeywords.filter(keyword =>
      responseWords.some(word => word.includes(keyword.toLowerCase()))
    );

    if (coveredKeywords.length > 0) {
      feedback.push(`Strong points: You covered ${coveredKeywords.join(', ')}`);
    }

    // Check missing topics
    const missingKeywords = expectedKeywords.filter(keyword =>
      !responseWords.some(word => word.includes(keyword.toLowerCase()))
    );

    if (missingKeywords.length > 0) {
      feedback.push(`Areas for improvement: Consider discussing ${missingKeywords.join(', ')}`);
    }

    return feedback;
  }

  generateFollowUpQuestion(category: string, difficulty: string, previousQuestions: string[]): string {
    const availableQuestions = this.getQuestionsForCategory(category, difficulty)
      .filter(q => !previousQuestions.includes(q.id));

    if (availableQuestions.length === 0) {
      return "That concludes our interview questions for this category and difficulty level.";
    }

    return availableQuestions[0].question;
  }
}

export const interviewService = new InterviewService();
