export interface AnswerGroup {
  count: number;
  answers: string[];
}

export interface Question {
  text: string;
  groups: AnswerGroup[];
  llmScore: number;
  maxScore: number;
  rationale: string;
  teacherScore: number;
}
