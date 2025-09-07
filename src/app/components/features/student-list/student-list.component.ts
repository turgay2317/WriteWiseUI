import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentApiService } from '../../../services/api/student-api.service';
import { AppStateService } from '../../../services/core/app-state.service';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-list.component.html'
})
export class StudentListComponent implements OnInit {
  examQuestions: any[] = [];

  constructor(
    public studentService: StudentApiService,
    public appState: AppStateService
  ) {}

  ngOnInit() {
    // Component yüklendiğinde öğrencileri çek
    this.studentService.loadStudents().subscribe({
      next: () => {
        console.log('Students loaded successfully');
      },
      error: (error) => {
        console.error('Error loading students:', error);
      }
    });
  }

  @HostListener('window:keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {
    if (this.appState.expandedModule() !== 'ogrenciler') return;
    
    const list = this.studentService.filteredStudents();
    if (event.key === 'Escape') {
      event.preventDefault();
      this.onBack();
      return;
    }

    if (!this.studentService.selectedStudent()) {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        this.studentService.selectStudentByIndex(this.studentService.focusStudentIdx() + 1);
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        this.studentService.selectStudentByIndex(this.studentService.focusStudentIdx() - 1);
      } else if (event.key === 'Enter') {
        event.preventDefault();
        if (this.studentService.focusStudentIdx() < 0 && list.length) {
          this.studentService.focusStudentIdx.set(0);
        }
        this.studentService.chooseFocusedStudent();
      }
      return;
    }

    if (this.studentService.selectedStudent() && !this.studentService.selectedExam()) {
      const exams = this.studentService.exams();
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        this.studentService.focusExamIdx.set(
          Math.min(this.studentService.focusExamIdx() + 1, exams.length - 1)
        );
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        this.studentService.focusExamIdx.set(
          Math.max(this.studentService.focusExamIdx() - 1, 0)
        );
      } else if (event.key === 'Enter') {
        event.preventDefault();
        const idx = this.studentService.focusExamIdx();
        if (idx >= 0) {
          this.studentService.selectExam(exams[idx]);
        }
      }
    }
  }

  onBack() {
    if (this.studentService.selectedExam()) {
      this.studentService.selectedExam.set(null);
      return;
    }
    if (this.studentService.selectedStudent()) {
      this.studentService.selectedStudent.set(null);
      return;
    }
    this.appState.collapseAll();
  }

  formatTurkishDate(dateStr: string): string {
    if (!dateStr) return '';
    
    // Eğer zaten Türkçe formatındaysa direkt döndür
    if (dateStr.includes('Eylül') || dateStr.includes('Ekim') || dateStr.includes('Kasım')) {
      return dateStr;
    }
    
    // İngilizce tarihi Türkçe'ye çevir
    const months: { [key: string]: string } = {
      'January': 'Ocak', 'February': 'Şubat', 'March': 'Mart', 'April': 'Nisan',
      'May': 'Mayıs', 'June': 'Haziran', 'July': 'Temmuz', 'August': 'Ağustos',
      'September': 'Eylül', 'October': 'Ekim', 'November': 'Kasım', 'December': 'Aralık'
    };
    
    const parts = dateStr.split(' ');
    if (parts.length >= 2) {
      const day = parts[0];
      const month = months[parts[1]] || parts[1];
      return `${day} ${month}`;
    }
    
    return dateStr;
  }

  getExamQuestions(): any[] {
    return this.examQuestions;
  }

  loadExamQuestions() {
    const selectedStudent = this.studentService.selectedStudent();
    const selectedExam = this.studentService.selectedExam();
    
    if (selectedStudent && selectedExam) {
      this.studentService.loadStudentExamQuestions(
        parseInt(selectedStudent.id), 
        parseInt(selectedExam.id)
      ).subscribe({
        next: (response: any) => {
          this.examQuestions = response.questions || [];
        },
        error: (error) => {
          console.error('Error loading exam questions:', error);
          this.examQuestions = [];
        }
      });
    }
  }
}
