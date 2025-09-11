import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { AppStateService } from '../../../services/core/app-state.service';
import { ToastService } from '../../../services/core/toast.service';
import { ClassApiService } from '../../../services/api/class-api.service';
import { ExamApiService } from '../../../services/api/exam-api.service';

interface Sinif {
  id: number;
  ad: string;
  ogretmen_id: number;
  dersler?: Ders[];
}

interface Ders {
  id: number;
  ad: string;
  ders_adi: string;
  sinif_id: number;
  ogretmen_id: number;
}

@Component({
  selector: 'app-classes-subjects',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './classes-subjects.component.html'
})
export class ClassesSubjectsComponent implements OnInit, OnDestroy {
  siniflar: Sinif[] = [];
  seciliSinif: Sinif | null = null;
  dersler: Ders[] = [];
  seciliDers: Ders | null = null;
  
  // Form states
  isAddingClass = false;
  isEditingClass = false;
  isAddingSubject = false;
  isEditingSubject = false;
  
  // Form data
  newClassData = { ad: '' };
  editClassData = { ad: '' };
  newSubjectData = { ad: '', ders_adi: '' };
  editSubjectData = { ad: '', ders_adi: '' };
  
  isLoading = false;
  errorMessage = '';
  
  private destroy$ = new Subject<void>();

  constructor(
    public appState: AppStateService,
    private toastService: ToastService,
    private classApiService: ClassApiService,
    private examApiService: ExamApiService
  ) {}

  ngOnInit() {
    this.loadSiniflar();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadSiniflar() {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.examApiService.getSiniflar()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.siniflar = response.siniflar || [];
          this.isLoading = false;
        },
        error: (error) => {
          this.errorMessage = error.error?.error || 'Sınıflar yüklenemedi';
          this.isLoading = false;
        }
      });
  }

  selectSinif(sinif: Sinif) {
    this.seciliSinif = sinif;
    this.dersler = sinif.dersler || [];
    this.seciliDers = null;
  }

  selectDers(ders: Ders) {
    this.seciliDers = ders;
  }

  // Sınıf CRUD işlemleri
  startAddingClass() {
    this.isAddingClass = true;
    this.newClassData = { ad: '' };
  }

  cancelAddingClass() {
    this.isAddingClass = false;
    this.newClassData = { ad: '' };
  }

  addClass() {
    if (!this.newClassData.ad.trim()) {
      this.toastService.pushToast('error', 'Sınıf adı boş olamaz');
      return;
    }

    this.isLoading = true;
    this.examApiService.addSinif(this.newClassData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          this.toastService.pushToast('success', response.message || 'Sınıf eklendi');
          this.isAddingClass = false;
          this.newClassData = { ad: '' };
          this.loadSiniflar();
        },
        error: (error: any) => {
          this.toastService.pushToast('error', error.error?.error || 'Sınıf eklenirken hata oluştu');
          this.isLoading = false;
        }
      });
  }

  startEditingClass(sinif: Sinif) {
    this.isEditingClass = true;
    this.editClassData = { ad: sinif.ad };
  }

  cancelEditingClass() {
    this.isEditingClass = false;
    this.editClassData = { ad: '' };
  }

  updateClass() {
    if (!this.editClassData.ad.trim()) {
      this.toastService.pushToast('error', 'Sınıf adı boş olamaz');
      return;
    }

    if (!this.seciliSinif) return;

    this.isLoading = true;
    this.examApiService.updateSinif(this.seciliSinif.id, this.editClassData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          this.toastService.pushToast('success', response.message || 'Sınıf güncellendi');
          this.isEditingClass = false;
          this.editClassData = { ad: '' };
          this.loadSiniflar();
        },
        error: (error: any) => {
          this.toastService.pushToast('error', error.error?.error || 'Sınıf güncellenirken hata oluştu');
          this.isLoading = false;
        }
      });
  }

  deleteClass(sinif: Sinif) {
    if (confirm(`${sinif.ad} sınıfını silmek istediğinizden emin misiniz?`)) {
      this.isLoading = true;
      this.examApiService.deleteSinif(sinif.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response: any) => {
            this.toastService.pushToast('success', response.message || 'Sınıf silindi');
            this.seciliSinif = null;
            this.dersler = [];
            this.seciliDers = null;
            this.loadSiniflar();
          },
          error: (error: any) => {
            this.toastService.pushToast('error', error.error?.error || 'Sınıf silinirken hata oluştu');
            this.isLoading = false;
          }
        });
    }
  }

  // Ders CRUD işlemleri
  startAddingSubject() {
    if (!this.seciliSinif) {
      this.toastService.pushToast('error', 'Önce bir sınıf seçin');
      return;
    }
    this.isAddingSubject = true;
    this.newSubjectData = { ad: '', ders_adi: '' };
  }

  cancelAddingSubject() {
    this.isAddingSubject = false;
    this.newSubjectData = { ad: '', ders_adi: '' };
  }

  addSubject() {
    if (!this.newSubjectData.ad.trim()) {
      this.toastService.pushToast('error', 'Ders adı boş olamaz');
      return;
    }

    if (!this.seciliSinif) {
      this.toastService.pushToast('error', 'Önce bir sınıf seçin');
      return;
    }

    this.isLoading = true;
    const dersData = {
      ad: this.newSubjectData.ad,
      ders_adi: this.newSubjectData.ders_adi,
      sinif_id: this.seciliSinif.id
    };

    this.examApiService.addDers(dersData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          this.toastService.pushToast('success', response.message || 'Ders eklendi');
          this.isAddingSubject = false;
          this.newSubjectData = { ad: '', ders_adi: '' };
          this.loadSiniflar();
        },
        error: (error: any) => {
          this.toastService.pushToast('error', error.error?.error || 'Ders eklenirken hata oluştu');
          this.isLoading = false;
        }
      });
  }

  startEditingSubject(ders: Ders) {
    this.isEditingSubject = true;
    this.editSubjectData = { ad: ders.ad, ders_adi: ders.ders_adi || '' };
  }

  cancelEditingSubject() {
    this.isEditingSubject = false;
    this.editSubjectData = { ad: '', ders_adi: '' };
  }

  updateSubject() {
    if (!this.editSubjectData.ad.trim()) {
      this.toastService.pushToast('error', 'Ders adı boş olamaz');
      return;
    }

    if (!this.seciliDers) {
      this.toastService.pushToast('error', 'Düzenlenecek ders seçilmedi');
      return;
    }

    this.isLoading = true;
    const dersData = {
      ad: this.editSubjectData.ad,
      ders_adi: this.editSubjectData.ders_adi
    };

    this.examApiService.updateDers(this.seciliDers.id, dersData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          this.toastService.pushToast('success', response.message || 'Ders güncellendi');
          this.isEditingSubject = false;
          this.editSubjectData = { ad: '', ders_adi: '' };
          this.loadSiniflar();
        },
        error: (error: any) => {
          this.toastService.pushToast('error', error.error?.error || 'Ders güncellenirken hata oluştu');
          this.isLoading = false;
        }
      });
  }

  deleteSubject(ders: Ders) {
    if (confirm(`${ders.ad} dersini silmek istediğinizden emin misiniz?`)) {
      this.isLoading = true;
      this.examApiService.deleteDers(ders.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response: any) => {
            this.toastService.pushToast('success', response.message || 'Ders silindi');
            this.loadSiniflar();
          },
          error: (error: any) => {
            this.toastService.pushToast('error', error.error?.error || 'Ders silinirken hata oluştu');
            this.isLoading = false;
          }
        });
    }
  }
}
