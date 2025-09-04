import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadedExamService } from '../../core/services/uploaded-exam.service';
import { AppStateService } from '../../core/services/app-state.service';

@Component({
  selector: 'app-uploaded-exams',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './uploaded-exams.component.html'
})
export class UploadedExamsComponent {
  constructor(
    public uploadedExamService: UploadedExamService,
    public appState: AppStateService
  ) {}
}
