import { UploadStatus } from './module.types';

export interface UploadedExam {
  id: string;
  title: string;
  subject: string;
  clazz: string;
  date: string;
  students: number;
  status: UploadStatus;
}
