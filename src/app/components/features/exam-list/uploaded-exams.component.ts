import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExamApiService } from '../../../services/api/exam-api.service';
import { AppStateService } from '../../../services/core/app-state.service';

@Component({
  selector: 'app-uploaded-exams',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './uploaded-exams.component.html'
})
export class UploadedExamsComponent {
  constructor(
    public uploadedExamService: ExamApiService,
    public appState: AppStateService
  ) {}
}
