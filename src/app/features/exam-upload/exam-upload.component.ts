import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppStateService } from '../../core/services/app-state.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-exam-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './exam-upload.component.html'
})
export class ExamUploadComponent {
  constructor(
    public appState: AppStateService,
    private toastService: ToastService
  ) {}

  onAnalysisStart() {
    this.toastService.startAnalysisSuccess();
  }
}
