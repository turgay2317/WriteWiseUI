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
  selector: 'app-class-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Sınıflarım Yönetimi -->
    <div class="h-full max-h-full p-4 lg:p-6 overflow-hidden relative">
      <!-- Kapat Butonu -->
      <div class="absolute top-4 right-4 z-10">
        <button class="btn btn-ghost p-2" (click)="appState.collapseAll()" aria-label="Kapat">
          <span class="text-lg font-bold text-espresso">✕</span>
        </button>
      </div>
      
      <div class="h-full flex flex-col">
        <!-- Başlık ve Yeni Sınıf Butonu -->
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-espresso">Sınıflarım</h2>
          <button 
            class="btn btn-primary"
            (click)="startAddingClass()"
            [disabled]="isAddingClass">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            Yeni Sınıf
          </button>
        </div>

        <!-- Sınıf Ekleme Formu -->
        <div *ngIf="isAddingClass" class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 class="text-lg font-semibold text-espresso mb-4">Yeni Sınıf Ekle</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-espresso mb-2">Sınıf Adı</label>
              <input 
                type="text" 
                [(ngModel)]="newClassData.ad"
                placeholder="Sınıf adı (örn: 4A)"
                class="input input-bordered w-full"
                maxlength="50">
            </div>
            <div class="flex items-end gap-2">
              <button 
                class="btn btn-primary"
                (click)="addClass()"
                [disabled]="!newClassData.ad.trim() || isLoading">
                Kaydet
              </button>
              <button 
                class="btn btn-ghost"
                (click)="cancelAddingClass()">
                İptal
              </button>
            </div>
          </div>
        </div>

        <!-- Sınıf Listesi -->
        <div class="flex-1 overflow-auto">
          <div *ngIf="isLoading" class="flex justify-center items-center h-32">
            <div class="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
          </div>
          
          <div *ngIf="!isLoading && siniflar.length === 0" class="text-center py-12 text-espresso/60">
            <svg class="w-16 h-16 mx-auto mb-4 text-espresso/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M8 7h8"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M8 11h8"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M8 15h5"/>
            </svg>
            <p class="text-lg font-medium">Henüz sınıf eklenmemiş</p>
            <p class="text-sm">Yeni sınıf eklemek için yukarıdaki butonu kullanın</p>
          </div>
          
          <div *ngIf="!isLoading && siniflar.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div 
              *ngFor="let sinif of siniflar" 
              class="card p-4 hover:shadow-lg transition-all duration-200 border border-borderGray">
              
              <!-- Sınıf Düzenleme Formu -->
              <div *ngIf="isEditingClass && editingClassId === sinif.id" class="space-y-3">
                <input 
                  type="text" 
                  [(ngModel)]="editClassData.ad"
                  class="input input-bordered w-full"
                  maxlength="50">
                <div class="flex gap-2">
                  <button 
                    class="btn btn-primary btn-sm"
                    (click)="updateClass(sinif)"
                    [disabled]="!editClassData.ad.trim() || isLoading">
                    Kaydet
                  </button>
                  <button 
                    class="btn btn-ghost btn-sm"
                    (click)="cancelEditingClass()">
                    İptal
                  </button>
                </div>
              </div>
              
              <!-- Sınıf Görünümü -->
              <div *ngIf="!isEditingClass || editingClassId !== sinif.id">
                <div class="flex items-start justify-between mb-3">
                  <div class="flex-1">
                    <h3 class="text-lg font-semibold text-espresso mb-1">{{ sinif.ad }}</h3>
                    <p class="text-sm text-espresso/60">{{ (sinif.dersler || []).length }} ders</p>
                  </div>
                  <div class="flex gap-1">
                    <button 
                      class="btn btn-ghost btn-xs"
                      (click)="startEditingClass(sinif)"
                      title="Düzenle">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                      </svg>
                    </button>
                    <button 
                      class="btn btn-ghost btn-xs text-red-600"
                      (click)="deleteClass(sinif)"
                      title="Sil">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </div>
                </div>
                
                <!-- Dersler Listesi -->
                <div *ngIf="sinif.dersler && sinif.dersler.length > 0" class="space-y-1">
                  <div class="text-xs font-medium text-espresso/70 mb-2">Dersler:</div>
                  <div *ngFor="let ders of sinif.dersler" class="text-sm text-espresso/80 bg-gray-50 px-2 py-1 rounded">
                    {{ ders.ad }}
                  </div>
                </div>
                
                <div *ngIf="!sinif.dersler || sinif.dersler.length === 0" class="text-xs text-espresso/50">
                  Henüz ders eklenmemiş
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ClassManagementComponent implements OnInit, OnDestroy {
  siniflar: Sinif[] = [];
  
  // Form states
  isAddingClass = false;
  isEditingClass = false;
  editingClassId: number | null = null;
  
  // Form data
  newClassData = { ad: '' };
  editClassData = { ad: '' };
  
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
          this.toastService.pushToast('error', this.errorMessage);
        }
      });
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
    this.editingClassId = sinif.id;
    this.editClassData = { ad: sinif.ad };
  }

  cancelEditingClass() {
    this.isEditingClass = false;
    this.editingClassId = null;
    this.editClassData = { ad: '' };
  }

  updateClass(sinif: Sinif) {
    if (!this.editClassData.ad.trim()) {
      this.toastService.pushToast('error', 'Sınıf adı boş olamaz');
      return;
    }

    this.isLoading = true;
    this.examApiService.updateSinif(sinif.id, this.editClassData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          this.toastService.pushToast('success', response.message || 'Sınıf güncellendi');
          this.isEditingClass = false;
          this.editingClassId = null;
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
            this.loadSiniflar();
          },
          error: (error: any) => {
            this.toastService.pushToast('error', error.error?.error || 'Sınıf silinirken hata oluştu');
            this.isLoading = false;
          }
        });
    }
  }
}
