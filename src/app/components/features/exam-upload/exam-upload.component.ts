import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppStateService } from '../../../services/core/app-state.service';
import { ToastService } from '../../../services/core/toast.service';
import { AuthApiService } from '../../../services/api/auth-api.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-exam-upload',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './exam-upload.component.html'
})
export class ExamUploadComponent implements OnInit, OnDestroy {
  // Form data
  evaluationRules: string = 'Açık uçlu sorularda anahtar kavramlar geçerse kısmi puan ver.\nDoğru yöntem-yanlış sonuç için %50 puan uygula.\nÇoktan seçmelide net anahtar: yalnız doğru seçenek tam puan.';
  selectedDersId: number | null = null;
  selectedSinifId: number | null = null;
  
  // File handling
  selectedFiles: File[] = [];
  isDraggingOver = false;
  
  // Data
  dersler: any[] = [];
  siniflar: any[] = [];
  
  // UI state
  isUploading: boolean = false;
  uploadProgress: number = 0;
  errorMessage: string = '';
  successMessage: string = '';
  
  private destroy$ = new Subject<void>();

  constructor(
    public appState: AppStateService,
    private toastService: ToastService,
    private authService: AuthApiService
  ) {}

  ngOnInit() {
    this.loadSiniflar();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSinifChange() {
    if (this.selectedSinifId) {
      this.loadDerslerForSinif(this.selectedSinifId);
    } else {
      this.dersler = [];
      this.selectedDersId = null;
    }
  }

  private loadDerslerForSinif(sinifId: number) {
    this.authService.getSinifDersler(sinifId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.dersler = response.dersler || [];
          this.selectedDersId = null; // Reset ders selection
        },
        error: (error) => {
          console.error('Error loading dersler for sinif:', error);
          this.errorMessage = 'Dersler yüklenemedi';
        }
      });
  }

  private loadSiniflar() {
    // Öğretmenin sınıflarını getir
    this.authService.getTeacherSiniflar()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.siniflar = response.siniflar || [];
        },
        error: (error) => {
          console.error('Error loading siniflar:', error);
          this.errorMessage = 'Sınıflar yüklenemedi';
        }
      });
  }

  // File handling methods
  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDraggingOver = false;
    
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFileSelection(Array.from(files));
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDraggingOver = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDraggingOver = false;
  }

  onFileInputChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFileSelection(Array.from(input.files));
    }
  }

  private handleFileSelection(files: File[]) {
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    const maxSize = 25 * 1024 * 1024; // 25MB in bytes
    const validFiles: File[] = [];

    for (const file of files) {
      // File type validation
      if (!allowedTypes.includes(file.type)) {
        this.errorMessage = 'Sadece PNG, JPG dosyaları desteklenir';
        continue;
      }

      // File size validation (25MB)
      if (file.size > maxSize) {
        this.errorMessage = 'Dosya boyutu 25MB\'dan küçük olmalıdır';
        continue;
      }

      validFiles.push(file);
    }

    if (validFiles.length > 0) {
      this.selectedFiles = [...this.selectedFiles, ...validFiles];
      this.errorMessage = '';
    }
  }

  clearSelectedFiles() {
    this.selectedFiles = [];
    this.errorMessage = '';
  }

  removeFile(index: number) {
    this.selectedFiles.splice(index, 1);
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const mb = bytes / (k * k);
    return `${mb.toFixed(1)} MB`;
  }

  onSaveExam() {
    if (this.selectedFiles.length === 0) {
      this.errorMessage = 'Lütfen en az bir fotoğraf seçin';
      return;
    }

    if (!this.selectedDersId || !this.selectedSinifId) {
      this.errorMessage = 'Lütfen ders ve sınıf seçin';
      return;
    }

    this.isUploading = true;
    this.uploadProgress = 0;
    this.errorMessage = '';
    this.successMessage = '';

    // Progress simulation
    const progressInterval = setInterval(() => {
      if (this.uploadProgress < 90) {
        this.uploadProgress += 10;
      }
    }, 500);

    const requestData = {
      ders_id: this.selectedDersId,
      sinif_id: this.selectedSinifId,
      degerlendirme_hususu: this.evaluationRules
    };

    this.authService.startExamAnalysis(requestData, this.selectedFiles)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          clearInterval(progressInterval);
          this.uploadProgress = 100;
          this.isUploading = false;
          this.successMessage = 'Sınav analizi başarıyla tamamlandı!';
          
          // Reset form
          setTimeout(() => {
            this.selectedFiles = [];
            this.selectedDersId = null;
            this.selectedSinifId = null;
            this.evaluationRules = 'Açık uçlu sorularda anahtar kavramlar geçerse kısmi puan ver.\nDoğru yöntem-yanlış sonuç için %50 puan uygula.\nÇoktan seçmelide net anahtar: yalnız doğru seçenek tam puan.';
            this.successMessage = '';
            this.uploadProgress = 0;
          }, 3000);
        },
        error: (error) => {
          clearInterval(progressInterval);
          this.isUploading = false;
          this.uploadProgress = 0;
          this.errorMessage = error.error?.error || 'Sınav analizi başlatılamadı';
        }
      });
  }
}
