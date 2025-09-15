import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ExamApiService } from '../../../services/api/exam-api.service';
import { ToastService } from '../../../services/core/toast.service';
import { AppStateService } from '../../../services/core/app-state.service';

interface CevapGrubu {
  id: number;
  cevap: string;
  puan: number;
  analizler: Analiz[];
}

interface Analiz {
  id: number;
  ogrenci: {
    id: number;
    ad: string;
    soyad: string;
    numara: string;
  };
  pozitif: string[];
  negatif: string[];
}

interface Soru {
  id: number;
  soru: string;
  soru_no: number;
  puan: number;
  kisitlamalar: string[];
  cevaplar: CevapGrubu[];
}

@Component({
  selector: 'app-question-analysis',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './question-analysis.component.html'
})
export class QuestionAnalysisComponent implements OnInit, OnDestroy {
  sinavId: number = 0;
  soruNo: number = 1;
  soru: Soru | null = null;
  sonrakiSoruId: number | null = null;
  currentCevapIndex: number = 0;
  isLoading = false;
  errorMessage = '';
  
  // Puan güncelleme için
  updatingPuan: { [cevapId: number]: boolean } = {};
  editingPuan: { [cevapId: number]: number } = {};
  originalPuan: { [cevapId: number]: number } = {};
  
  // Değerlendirme güncelleme için
  updatingDegerlendirme: { [analizId: number]: boolean } = {};
  editingDegerlendirme: { [analizId: number]: { pozitif: string; negatif: string } } = {};
  
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private examApiService: ExamApiService,
    private toastService: ToastService,
    public appState: AppStateService
  ) {}

  ngOnInit() {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.sinavId = +params['sinavId'];
      this.soruNo = +params['soruNo'];
      this.loadSoru();
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadSoru() {
    this.isLoading = true;
    this.errorMessage = '';
    
    const token = localStorage.getItem('jwt_token');
    console.log('Soru yükleniyor:', { sinavId: this.sinavId, soruNo: this.soruNo, hasToken: !!token });
    
    if (!token) {
      this.errorMessage = 'Oturum süresi dolmuş. Lütfen tekrar giriş yapın.';
      this.isLoading = false;
      return;
    }
    
    this.examApiService.getSoru(this.sinavId, this.soruNo)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.soru = response.soru;
          this.sonrakiSoruId = response.sonraki_soru_id;
          this.isLoading = false;
          
          // Debug: Veri yapısını kontrol et
          console.log('Soru yüklendi:', this.soru);
          console.log('Cevap grupları:', this.soru?.cevaplar);
          if (this.soru?.cevaplar && this.soru.cevaplar.length > 0) {
            console.log('İlk cevap grubu:', this.soru?.cevaplar?.[0]);
            console.log('İlk cevap grubu analizleri:', this.soru?.cevaplar?.[0]?.analizler);
          }
          
          // Puan düzenleme için başlangıç değerlerini ayarla
          this.initializePuanEditing();
        },
        error: (error) => {
          console.error('Soru yükleme hatası:', error);
          if (error.status === 401) {
            this.errorMessage = 'Oturum süresi dolmuş. Lütfen tekrar giriş yapın.';
          } else if (error.status === 403) {
            this.errorMessage = 'Bu sınava erişim yetkiniz yok.';
          } else if (error.status === 404) {
            this.errorMessage = 'Soru bulunamadı.';
          } else {
            this.errorMessage = error.error?.error || 'Soru yüklenemedi';
          }
          this.isLoading = false;
        }
      });
  }

  nextSoru() {
    if (this.sonrakiSoruId) {
      this.router.navigate(['/sinav', this.sinavId, 'soru', this.sonrakiSoruId]);
    }
  }

  prevSoru() {
    if (this.soruNo > 1) {
      this.router.navigate(['/sinav', this.sinavId, 'soru', this.soruNo - 1]);
    }
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }

  getFirstEditingKey(): string {
    const keys = Object.keys(this.editingDegerlendirme);
    return keys.length > 0 ? keys[0] : '';
  }

  updatePuan(cevapId: number, yeniPuan: number) {
    if (!this.soru) return;
    
    this.updatingPuan[cevapId] = true;
    
    // Grup ID'si ile puan güncelleme (cevapId artık grup ID'si)
    this.examApiService.updateGrupPuan(this.soru.id, cevapId, yeniPuan)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          // Local state'i güncelle
          const cevap = this.soru?.cevaplar.find(c => c.id === cevapId);
          if (cevap) {
            cevap.puan = yeniPuan;
            this.originalPuan[cevapId] = yeniPuan; // Orijinal değeri güncelle
          }
          this.updatingPuan[cevapId] = false;
          this.toastService.pushToast('success', 'Puan başarıyla güncellendi');
        },
        error: (error) => {
          this.updatingPuan[cevapId] = false;
          this.toastService.pushToast('error', error.error?.error || 'Puan güncellenemedi');
        }
      });
  }

  initializePuanEditing() {
    if (!this.soru) return;
    
    this.editingPuan = {};
    this.originalPuan = {};
    
    for (const cevap of this.soru.cevaplar) {
      this.editingPuan[cevap.id] = cevap.puan;
      this.originalPuan[cevap.id] = cevap.puan;
    }
  }

  adjustPuan(cevapId: number, delta: number) {
    if (!this.soru) return;
    
    const cevap = this.soru.cevaplar.find(c => c.id === cevapId);
    if (cevap) {
      const yeniPuan = Math.max(0, this.editingPuan[cevapId] + delta);
      this.editingPuan[cevapId] = yeniPuan;
    }
  }

  onPuanChange(cevapId: number) {
    // Input değiştiğinde sadece editingPuan güncellenir, API çağrısı yapılmaz
  }

  hasPuanChanged(cevapId: number): boolean {
    return this.editingPuan[cevapId] !== this.originalPuan[cevapId];
  }

  savePuan(cevapId: number) {
    if (!this.soru) return;
    
    const yeniPuan = this.editingPuan[cevapId];
    this.updatePuan(cevapId, yeniPuan);
  }

  startEditingDegerlendirme(analizId: number, pozitif: string[], negatif: string[]) {
    this.editingDegerlendirme[analizId] = {
      pozitif: pozitif.join(', '),
      negatif: negatif.join(', ')
    };
  }

  saveDegerlendirme(analizId: number) {
    if (!this.editingDegerlendirme[analizId]) return;
    
    this.updatingDegerlendirme[analizId] = true;
    
    const { pozitif, negatif } = this.editingDegerlendirme[analizId];
    
    this.examApiService.updateAnalizDegerlendirme(analizId, pozitif, negatif)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          // Local state'i güncelle
          if (this.soru) {
            for (const cevap of this.soru.cevaplar) {
              const analiz = cevap.analizler.find(a => a.id === analizId);
              if (analiz) {
                analiz.pozitif = pozitif.split(',').map(s => s.trim()).filter(s => s);
                analiz.negatif = negatif.split(',').map(s => s.trim()).filter(s => s);
                break;
              }
            }
          }
          
          this.updatingDegerlendirme[analizId] = false;
          delete this.editingDegerlendirme[analizId];
          this.toastService.pushToast('success', 'Değerlendirme başarıyla güncellendi');
        },
        error: (error) => {
          this.updatingDegerlendirme[analizId] = false;
          this.toastService.pushToast('error', error.error?.error || 'Değerlendirme güncellenemedi');
        }
      });
  }

  cancelEditingDegerlendirme(analizId: number) {
    delete this.editingDegerlendirme[analizId];
  }

  isEditingDegerlendirme(analizId: number): boolean {
    return this.editingDegerlendirme.hasOwnProperty(analizId);
  }

  hasEditingDegerlendirme(): boolean {
    return Object.keys(this.editingDegerlendirme).length > 0;
  }

  getTotalStudentAnswers(): number {
    if (!this.soru) return 0;
    return this.soru.cevaplar.reduce((sum, c) => sum + c.analizler.length, 0);
  }

  getCurrentCevap(): CevapGrubu | null {
    if (!this.soru || !this.soru.cevaplar.length || this.currentCevapIndex < 0 || this.currentCevapIndex >= this.soru.cevaplar.length) {
      return null;
    }
    return this.soru.cevaplar[this.currentCevapIndex];
  }

  prevCevap() {
    if (this.currentCevapIndex > 0) {
      this.currentCevapIndex--;
    }
  }

  nextCevap() {
    if (this.soru && this.currentCevapIndex < this.soru.cevaplar.length - 1) {
      this.currentCevapIndex++;
    }
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }
}
