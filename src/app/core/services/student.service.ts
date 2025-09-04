import { Injectable, computed, signal } from '@angular/core';
import { Student, ExamRow } from '../models';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  // Students data
  private studentsSignal = signal<Student[]>([
    { id: 's1', name: 'Bertan Sezgin' },
    { id: 's2', name: 'Turgay Ceylan' },
    { id: 's3', name: 'Ali Kaya' },
    { id: 's4', name: 'Elif Yılmaz' },
    { id: 's5', name: 'Merve Demir' },
    { id: 's6', name: 'Ahmet Yıldız' },
    { id: 's7', name: 'Zeynep Koç' },
    { id: 's8', name: 'Mehmet Öz' },
    { id: 's9', name: 'Ayşe Kara' },
  ]);

  // Exams data  
  private examsSignal = signal<ExamRow[]>([
    { id: 'e1', date: '12 Ekim', subject: 'Matematik', type: 'Çoktan Seçmeli', score: 78, copyProb: 12 },
    { id: 'e2', date: '10 Kasım', subject: 'Türkçe', type: 'Açık Uçlu', score: 84, copyProb: 7 },
    { id: 'e3', date: '20 Aralık', subject: 'Fen', type: 'Karma', score: 73, copyProb: 18 },
  ]);

  // Query and selection signals
  private querySignal = signal('');
  private selectedStudentSignal = signal<Student | null>(null);
  private selectedExamSignal = signal<ExamRow | null>(null);
  private focusStudentIdxSignal = signal<number>(-1);
  private focusExamIdxSignal = signal<number>(-1);
  private activePaneIndexSignal = signal(0);

  // Computed properties
  public filteredStudents = computed(() => {
    const q = this.querySignal().trim().toLowerCase();
    return this.studentsSignal().filter(s => 
      !q || s.name.toLowerCase().includes(q) || s.id.includes(q)
    );
  });

  // Getters
  get students() { return this.studentsSignal; }
  get exams() { return this.examsSignal; }
  get query() { return this.querySignal; }
  get selectedStudent() { return this.selectedStudentSignal; }
  get selectedExam() { return this.selectedExamSignal; }
  get focusStudentIdx() { return this.focusStudentIdxSignal; }
  get focusExamIdx() { return this.focusExamIdxSignal; }
  get activePaneIndex() { return this.activePaneIndexSignal; }

  // Actions
  setQuery(query: string) {
    this.querySignal.set(query);
  }

  selectStudent(student: Student) {
    this.selectedStudentSignal.set(student);
    this.selectedExamSignal.set(null);
    this.activePaneIndexSignal.set(1);
    this.focusExamIdxSignal.set(-1);
  }

  selectExam(exam: ExamRow) {
    this.selectedExamSignal.set(exam);
    this.activePaneIndexSignal.set(2);
  }

  selectStudentByIndex(idx: number) {
    const list = this.filteredStudents();
    if (!list.length) return;
    const clamped = Math.max(0, Math.min(idx, list.length - 1));
    this.focusStudentIdxSignal.set(clamped);
  }

  chooseFocusedStudent() {
    const idx = this.focusStudentIdxSignal();
    const list = this.filteredStudents();
    if (idx >= 0 && idx < list.length) {
      this.selectStudent(list[idx]);
    }
  }

  resetStudentModule() {
    this.selectedStudentSignal.set(null);
    this.selectedExamSignal.set(null);
    this.activePaneIndexSignal.set(0);
  }

  backOne() {
    if (this.selectedExamSignal()) {
      this.selectedExamSignal.set(null);
      this.activePaneIndexSignal.set(1);
      return;
    }
    if (this.selectedStudentSignal()) {
      this.selectedStudentSignal.set(null);
      this.activePaneIndexSignal.set(0);
      return;
    }
  }
}
