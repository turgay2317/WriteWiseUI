import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentApiService } from '../../../services/api/student-api.service';
import { AppStateService } from '../../../services/core/app-state.service';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-list.component.html'
})
export class StudentListComponent {
  constructor(
    public studentService: StudentApiService,
    public appState: AppStateService
  ) {}

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
}
