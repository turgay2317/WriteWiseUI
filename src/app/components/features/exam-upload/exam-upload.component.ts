import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppStateService } from '../../../services/core/app-state.service';
import { ToastService } from '../../../services/core/toast.service';
import { ExamApiService } from '../../../services/api/exam-api.service';

@Component({
  selector: 'app-exam-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './exam-upload.component.html'
})
export class ExamUploadComponent {
  constructor(
    public appState: AppStateService,
    private toastService: ToastService,
    private examApi: ExamApiService
  ) {}

  selectedFile: File | null = null;
  isDraggingOver = false;
  isUploading = false;
  uploadProgress = 0;
  classInput = '';
  classes: string[] = [];
  classError: string | null = null;
  dateInputType: 'text' | 'date' = 'text';

  get hasSelectedFile(): boolean {
    return this.selectedFile !== null;
  }

  onFileInputChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files && input.files.length ? input.files[0] : null;
    this.selectedFile = file;
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDraggingOver = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDraggingOver = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDraggingOver = false;
    const files = event.dataTransfer?.files;
    this.selectedFile = files && files.length ? files[0] : null;
  }

  clearSelectedFile() {
    if (this.isUploading) return;
    this.selectedFile = null;
  }

  formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    const mb = kb / 1024;
    return `${mb.toFixed(1)} MB`;
  }

  onAnalysisStart() {
    if (!this.selectedFile || this.isUploading) {
      this.toastService.startAnalysisError();
      return;
    }

    // Derlenecek bilgiler
    const rules = (document.querySelector('#rules-textarea') as HTMLTextAreaElement)?.value || '';
    const subject = (document.querySelector('#subject-input') as HTMLInputElement)?.value?.trim() || '';
    const dateInput = (document.querySelector('#date-input') as HTMLInputElement)?.value || '';
    if (!subject) {
      this.toastService.pushToast('error', 'Ders adını giriniz.');
      return;
    }
    if (!this.classes.length) {
      this.toastService.pushToast('error', 'En az bir sınıf ekleyiniz.');
      return;
    }
    if (!dateInput) {
      this.toastService.pushToast('error', 'Tarih giriniz.');
      return;
    }

    this.isUploading = true;
    this.uploadProgress = 0;

    this.examApi.analyzeUpload({
      file: this.selectedFile,
      rules,
      subject,
      classes: this.classes,
      date: dateInput
    }).subscribe({
      next: (res) => {
        this.uploadProgress = this.examApi.uploadProgress();
        if (res.success) {
          this.isUploading = false;
          this.toastService.startAnalysisSuccess();
          this.selectedFile = null;
          this.classes = [];
          this.classInput = '';
        }
      },
      error: () => {
        this.isUploading = false;
        this.toastService.startAnalysisError();
      }
    });
  }

  onClassInputChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.classInput = input.value;
    this.classError = null;
  }

  addClass() {
    if (this.isUploading) return;
    const normalized = this.classInput.toUpperCase().replace(/\s+/g, '');
    if (!normalized) {
      this.classError = 'Sınıf kodu boş olamaz';
      return;
    }
    if (!this.isValidClassCode(normalized)) {
      this.classError = 'Geçersiz sınıf: 1-12 ve ardından tek harf A-G, boşluksuz (örn. 4A, 12B)';
      return;
    }
    if (this.classes.includes(normalized)) {
      this.classError = 'Bu sınıf zaten eklendi';
      return;
    }
    this.classes = [...this.classes, normalized];
    this.classInput = '';
    this.classError = null;
  }

  removeClass(code: string) {
    if (this.isUploading) return;
    this.classes = this.classes.filter(c => c !== code);
  }

  private isValidClassCode(value: string): boolean {
    // Kurallar:
    // - Sayıyla başlamalı: 1-9 veya 10-12
    // - Toplam uzunluk 2 ya da 3 karakter (örn. 4A, 12B)
    // - Sadece tek harf olmalı ve A-G aralığında, büyük harf
    // - Boşluk yok
    if (value.length < 2 || value.length > 3) return false;
    if (/\s/.test(value)) return false;
    if (!/^(?:[1-9]|1[0-2])/.test(value)) return false;
    if (/^(?:[1-9])$|^(?:1[0-2])$/.test(value)) return false; // sadece sayı olamaz
    // Desenler: [1-9][A-G] (2 uzunluk) veya 1[0-2][A-G] (3 uzunluk)
    const pattern = /^(?:[1-9][A-G]|1[0-2][A-G])$/;
    return pattern.test(value);
  }

  onDateFocus() {
    this.dateInputType = 'date';
  }

  onDateBlur(event: FocusEvent) {
    const input = event.target as HTMLInputElement;
    if (!input.value) {
      this.dateInputType = 'text';
    }
  }
}
