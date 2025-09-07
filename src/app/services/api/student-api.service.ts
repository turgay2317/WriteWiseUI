import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Student, ExamRow } from '../../models';

const BASE_URL = 'http://localhost:5000/api';

@Injectable({
  providedIn: 'root'
})
export class StudentApiService {
  constructor(private http: HttpClient) {}
  // Students data
  private studentsSignal = signal<Student[]>([]);

  // Exams data  
  private examsSignal = signal<ExamRow[]>([]);

  // Query and selection signals
  private querySignal = signal('');
  private selectedStudentSignal = signal<Student | null>(null);
  private selectedExamSignal = signal<ExamRow | null>(null);
  private focusStudentIdxSignal = signal<number>(-1);
  private focusExamIdxSignal = signal<number>(-1);
  private activePaneIndexSignal = signal(0);
  
  // Sorting signals
  private examSortBySignal = signal<'subject' | 'date'>('subject');
  private examSortOrderSignal = signal<'asc' | 'desc'>('asc');
  private studentSortBySignal = signal<'name' | 'className'>('name');
  private studentSortOrderSignal = signal<'asc' | 'desc'>('asc');

  // Computed properties
  public filteredStudents = computed(() => {
    const q = this.querySignal().trim().toLowerCase();
    const list = this.studentsSignal().filter(s => 
      !q || s.name.toLowerCase().includes(q) || s.numara.toLowerCase().includes(q) || s.className.toLowerCase().includes(q)
    );
    const sortBy = this.studentSortBySignal();
    const sortOrder = this.studentSortOrderSignal();
    return [...list].sort((a, b) => {
      let cmp = 0;
      if (sortBy === 'className') {
        const aParts = this.parseClassNameParts(a.className);
        const bParts = this.parseClassNameParts(b.className);
        if (aParts.grade !== bParts.grade) {
          cmp = aParts.grade < bParts.grade ? -1 : 1;
        } else {
          const aSec = aParts.section;
          const bSec = bParts.section;
          if (aSec !== bSec) cmp = aSec < bSec ? -1 : 1;
          else cmp = 0;
        }
      } else {
        // Name sorting with locale awareness
        cmp = a.name.localeCompare(b.name, 'tr');
      }
      return sortOrder === 'asc' ? cmp : -cmp;
    });
  });

  public sortedExams = computed(() => {
    const exams = [...this.examsSignal()];
    const sortBy = this.examSortBySignal();
    const sortOrder = this.examSortOrderSignal();
    
    return exams.sort((a, b) => {
      let aVal, bVal;
      
      if (sortBy === 'subject') {
        aVal = a.subject.toLowerCase();
        bVal = b.subject.toLowerCase();
      } else {
        // Convert date string to comparable format
        aVal = this.parseTurkishDate(a.date);
        bVal = this.parseTurkishDate(b.date);
      }
      
      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
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
  get examSortBy() { return this.examSortBySignal; }
  get examSortOrder() { return this.examSortOrderSignal; }
  get studentSortBy() { return this.studentSortBySignal; }
  get studentSortOrder() { return this.studentSortOrderSignal; }

  // Actions
  setQuery(query: string) {
    this.querySignal.set(query);
  }

  selectStudent(student: Student) {
    this.selectedStudentSignal.set(student);
    this.selectedExamSignal.set(null);
    this.activePaneIndexSignal.set(1);
    this.focusExamIdxSignal.set(-1);
    
    // Öğrenci seçildiğinde sınavlarını yükle
    this.loadStudentExams(parseInt(student.id)).subscribe({
      next: () => {
        console.log('Student exams loaded');
      },
      error: (error) => {
        console.error('Error loading student exams:', error);
      }
    });
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

  sortExamsBy(field: 'subject' | 'date') {
    if (this.examSortBySignal() === field) {
      // Toggle order if same field
      this.examSortOrderSignal.set(this.examSortOrderSignal() === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field and default to asc
      this.examSortBySignal.set(field);
      this.examSortOrderSignal.set('asc');
    }
  }

  sortStudentsBy(field: 'name' | 'className') {
    if (this.studentSortBySignal() === field) {
      this.studentSortOrderSignal.set(this.studentSortOrderSignal() === 'asc' ? 'desc' : 'asc');
    } else {
      this.studentSortBySignal.set(field);
      this.studentSortOrderSignal.set('asc');
    }
  }

  private parseClassNameParts(className: string): { grade: number; section: string } {
    const match = className.trim().match(/^(\d+)\s*([A-Za-zÇĞİÖŞÜçğıöşü]*)$/);
    const grade = match ? parseInt(match[1], 10) : 0;
    const sectionRaw = match && match[2] ? match[2] : '';
    const section = sectionRaw.toUpperCase();
    return { grade, section };
  }

  private parseTurkishDate(dateStr: string): Date {
    const months: { [key: string]: number } = {
      'Ocak': 0, 'Şubat': 1, 'Mart': 2, 'Nisan': 3, 'Mayıs': 4, 'Haziran': 5,
      'Temmuz': 6, 'Ağustos': 7, 'Eylül': 8, 'Ekim': 9, 'Kasım': 10, 'Aralık': 11
    };
    
    const parts = dateStr.split(' ');
    const day = parseInt(parts[0]);
    const month = months[parts[1]];
    const year = new Date().getFullYear(); // Assume current year
    
    return new Date(year, month, day);
  }

  // API Methods
  loadStudents(): Observable<any> {
    const token = localStorage.getItem('jwt_token');
    return this.http.get(`${BASE_URL}/students`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }).pipe(
      tap((response: any) => {
        this.studentsSignal.set(response.students);
      })
    );
  }

  loadStudentExams(studentId: number): Observable<any> {
    const token = localStorage.getItem('jwt_token');
    return this.http.get(`${BASE_URL}/students/${studentId}/exams`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }).pipe(
      tap((response: any) => {
        // API'den gelen veriyi ExamRow interface'ine uygun şekilde map et
        const mappedExams: ExamRow[] = response.exams.map((exam: any) => ({
          id: exam.id.toString(),
          date: exam.date,
          subject: exam.subject,
          type: exam.type,
          score: exam.score || 0,
          copyProb: exam.copyProb || 0,
          maxScore: exam.maxScore || 0,
          averageScore: exam.averageScore || 0,
          copyText: exam.copyText || '',
          totalQuestions: exam.totalQuestions || 0,
          ders_id: exam.ders_id || 0
        }));
        this.examsSignal.set(mappedExams);
      })
    );
  }

  loadStudentExamQuestions(studentId: number, examId: number): Observable<any> {
    const token = localStorage.getItem('jwt_token');
    return this.http.get(`${BASE_URL}/students/${studentId}/exams/${examId}/questions`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
  }

  resetStudentModule() {
    this.selectedStudentSignal.set(null);
    this.selectedExamSignal.set(null);
    this.activePaneIndexSignal.set(0);
    this.studentsSignal.set([]);
    this.examsSignal.set([]);
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
