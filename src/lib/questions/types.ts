export type QuestionChoice = {
  label: string;
  content: string;
  isCorrect: boolean;
};

export type MultipleChoiceQuestion = {
  question: string;
  choices: QuestionChoice[];
  explanation?: string;
  hint?: string;
};

export type MultipleChoiceAnswer = string | null;
