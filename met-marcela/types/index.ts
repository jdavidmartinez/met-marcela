// types/index.ts
export interface Question {
    id: string;
    type: 'multiple-choice' | 'fill-in';
    audioUrl?: string;
    questionText: string;
    options: string[];
    correctAnswer: string;
  }