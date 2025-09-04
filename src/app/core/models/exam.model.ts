import { ExamType } from '../types/module.types';

export interface ExamRow {
  id: string;
  date: string;
  subject: string;
  type: ExamType;
  score: number;
  copyProb: number;
}
