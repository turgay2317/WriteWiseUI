import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { ClassApiService } from '../../../services/api/class-api.service';
import { ExamApiService } from '../../../services/api/exam-api.service';
import { AuthApiService } from '../../../services/api/auth-api.service';
import { AppStateService } from '../../../services/core/app-state.service';

interface SinavIstatistikleri {
  sinav_id: number;
  soru_sayisi: number;
  toplam_ogrenci: number;
  sinif_ortalamasi: number;
  kopya_ihtimali: number;
  en_yuksek_not: number;
  en_dusuk_not: number;
  puan_araliklari: {
    "85-100": number;
    "70-84.99": number;
    "60-69.99": number;
    "50-59.99": number;
    "0-49.99": number;
  };
  tarih: string;
}

@Component({
  selector: 'app-class-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './class-summary.component.html'
})
export class ClassSummaryComponent implements OnInit, OnDestroy {
  siniflar: any[] = [];
  seciliSinif: any = null;
  sinavlar: any[] = [];
  seciliSinav: any = null;
  istatistikler: SinavIstatistikleri | null = null;
  isLoading = false;
  errorMessage = '';
  
  private destroy$ = new Subject<void>();

  constructor(
    public classSummaryService: ClassApiService,
    public appState: AppStateService,
    private examApiService: ExamApiService,
    private authService: AuthApiService
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

  selectSinif(sinif: any) {
    this.seciliSinif = sinif;
    this.sinavlar = sinif.sinavlar || [];
    this.seciliSinav = null;
    this.istatistikler = null;
  }

  selectSinav(sinav: any) {
    this.seciliSinav = sinav;
    this.loadIstatistikler(sinav.sinav_id);
  }

  loadIstatistikler(sinavId: number) {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.examApiService.getSinavIstatistikleri(sinavId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.istatistikler = response;
          this.isLoading = false;
        },
        error: (error) => {
          this.errorMessage = error.error?.error || 'İstatistikler yüklenemedi';
          this.isLoading = false;
        }
      });
  }

  getPuanAraligiData() {
    if (!this.istatistikler) return [];
    
    const colors = ['#22c55e', '#84cc16', '#eab308', '#f97316', '#ef4444'];
    const labels = ['85-100', '70-84.99', '60-69.99', '50-59.99', '0-49.99'];
    
    return Object.entries(this.istatistikler.puan_araliklari).map(([key, value], index) => ({
      label: key,
      count: value,
      color: colors[index]
    }));
  }

  getKopyaIhtimaliColor() {
    if (!this.istatistikler) return '#22c55e';
    const ihtimal = this.istatistikler.kopya_ihtimali;
    if (ihtimal < 15) return '#22c55e';
    if (ihtimal < 40) return '#eab308';
    return '#ef4444';
  }
}
