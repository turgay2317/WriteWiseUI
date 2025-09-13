import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../components/shared/header/header.component';
import { StudentPortalService } from '../../services/api/student-portal.service';
import { AuthApiService } from '../../services/api/auth-api.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-student-page',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent],
  template: `
    <app-header 
      [panelTitle]="'Öğrenci Paneli'" 
      [subtitle]="'WriteWise Eğitim Platformu'" 
      (logoutClick)="onLogout()"
    ></app-header>

    <main class="layout-container mx-auto max-w-6xl px-4 lg:px-8 py-4">
      <div class="mb-3">
        <h1 class="text-xl lg:text-2xl font-bold text-espresso text-center">
          Hoş geldin, {{ studentProfile ? (studentProfile.ad + ' ' + studentProfile.soyad) : 'Öğrenci' }}
        </h1>
      </div>

      <div class="grid gap-4 lg:grid-cols-2">
        <!-- Left: Exams (always visible) -->
        <section class="card p-3 h-full flex flex-col">
          <div class="text-base font-semibold text-espresso mb-2">Sınavlar</div>
          <div class="h-[420px] overflow-y-auto divide-y divide-borderGray/60 border border-borderGray rounded-lg">
            <div *ngIf="isLoading" class="h-full flex items-center justify-center text-espresso/60">
              Yükleniyor...
            </div>
            <button *ngFor="let exam of studentExams" 
                    class="w-full text-left h-14 px-3 hover:bg-primary/10" 
                    (click)="selectExam(exam)" 
                    [ngClass]="{'bg-infoSurface/30': selectedExam?.id===exam.id}">
              <div class="flex items-center justify-between h-full">
                <div class="text-[16px] font-semibold text-espresso">{{ exam.subject }}</div>
                <div class="text-sm text-espresso/70">{{ formatTurkishDate(exam.date) }}</div>
              </div>
              <div class="text-xs text-espresso/60">Puanınız: {{ exam.score }}</div>
            </button>
          </div>
          <div class="mt-2 text-sm text-espresso/80" *ngIf="selectedExam">
            Seçili sınav puanınız: <span class="font-semibold">{{ selectedExam?.score }}</span>
          </div>
        </section>

        <!-- Right: Exam Details -->
        <section class="card p-2 h-full flex flex-col">
          <div class="text-base font-semibold text-espresso mb-2">Sınav Detayları</div>
          <div class="h-[430px] overflow-y-auto rounded-lg">
            <div *ngIf="!selectedExam" class="h-full pt-0 px-2 pb-2">
              <div class="h-full border border-dashed border-borderGray rounded-lg grid place-items-center text-espresso/50">Listeden bir sınav seçin</div>
            </div>
            <div *ngIf="selectedExam" class="h-full p-3">
              <div class="h-full border border-borderGray rounded-lg">
                <!-- Toplam Puan -->
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                  <div class="text-center">
                    <div class="text-2xl font-bold text-blue-600">{{ getTotalScore() }} / {{ selectedExam.maxScore }}</div>
                    <div class="text-sm text-blue-600">Toplam Puan</div>
                  </div>
                </div>
                
                <!-- Soru Detayları -->
                <div class="space-y-3 p-3">
                  <div *ngFor="let q of examQuestions; index as i" class="card p-3">
                    <div class="flex items-start justify-between mb-2">
                      <div class="flex-1">
                        <div class="text-sm font-semibold text-espresso mb-1">Soru {{ i+1 }}</div>
                        <div class="text-sm text-espresso/80 mb-2">{{ q.text }}</div>
                      </div>
                      <div class="text-sm font-semibold text-espresso ml-2">{{ q.llmScore }} / {{ q.maxScore }}</div>
                    </div>
                    
                    <!-- Öğrenci Cevabı -->
                    <div class="mb-2">
                      <div class="text-xs font-medium text-espresso/70 mb-1">Öğrenci Cevabı:</div>
                      <div class="text-sm text-espresso/80 bg-gray-50 p-2 rounded border">{{ q.studentAnswer || 'Cevap bulunamadı' }}</div>
                    </div>
                    
                    <!-- Pozitif Analiz -->
                    <div *ngIf="q.positiveAnalysis" class="mb-2">
                      <div class="text-xs font-medium text-green-600 mb-1">✓ Pozitif Değerlendirme:</div>
                      <div class="text-sm text-green-700 bg-green-50 p-2 rounded border border-green-200">{{ q.positiveAnalysis }}</div>
                    </div>
                    
                    <!-- Negatif Analiz -->
                    <div *ngIf="q.negativeAnalysis" class="mb-2">
                      <div class="text-xs font-medium text-red-600 mb-1">⚠ Geliştirilmesi Gerekenler:</div>
                      <div class="text-sm text-red-700 bg-red-50 p-2 rounded border border-red-200">{{ q.negativeAnalysis }}</div>
                    </div>
                    
                    <!-- Genel Analiz (eğer pozitif/negatif yoksa) -->
                    <div *ngIf="!q.positiveAnalysis && !q.negativeAnalysis && q.rationale" class="mb-2">
                      <div class="text-xs font-medium text-espresso/70 mb-1">Analiz:</div>
                      <div class="text-sm text-espresso/70 bg-gray-50 p-2 rounded border">{{ q.rationale }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  `,
})
export class StudentPageComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  studentProfile: any = null;
  studentExams: any[] = [];
  selectedExam: any = null;
  examQuestions: any[] = [];
  isLoading = false;

  constructor(
    public svc: StudentPortalService,
    private authService: AuthApiService
  ) {}

  ngOnInit() {
    this.loadStudentProfile();
    this.loadStudentExams();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadStudentProfile() {
    this.authService.getStudentProfile().subscribe({
      next: (profile) => {
        this.studentProfile = profile;
      },
      error: (error) => {
        console.error('Error loading student profile:', error);
      }
    });
  }

  loadStudentExams() {
    this.isLoading = true;
    this.authService.getStudentAttendedExams().subscribe({
      next: (response) => {
        this.studentExams = response.exams || [];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading student attended exams:', error);
        // Fallback to mock data if API fails
        this.studentExams = this.svc.myExams();
        this.isLoading = false;
      }
    });
  }

  selectExam(exam: any) {
    this.selectedExam = exam;
    this.svc.selectExam(exam);
    this.loadExamQuestions(exam);
  }

  loadExamQuestions(exam: any) {
    this.authService.getStudentExamQuestions(parseInt(exam.id)).subscribe({
      next: (response) => {
        this.examQuestions = response.questions || [];
      },
      error: (error) => {
        console.error('Error loading exam questions:', error);
        // Fallback to mock data if API fails
        this.examQuestions = this.svc.selectedExamQuestions();
      }
    });
  }

  getTotalScore(): number {
    if (!this.selectedExam) return 0;
    return this.examQuestions.reduce((total, q) => total + (q.llmScore || 0), 0);
  }

  formatTurkishDate(dateStr: string): string {
    if (!dateStr) return '';
    
    // Eğer zaten Türkçe formatındaysa direkt döndür
    if (dateStr.includes('Eylül') || dateStr.includes('Ekim') || dateStr.includes('Kasım')) {
      return dateStr;
    }
    
    // İngilizce tarihi Türkçe'ye çevir
    const months: { [key: string]: string } = {
      'January': 'Ocak', 'February': 'Şubat', 'March': 'Mart', 'April': 'Nisan',
      'May': 'Mayıs', 'June': 'Haziran', 'July': 'Temmuz', 'August': 'Ağustos',
      'September': 'Eylül', 'October': 'Ekim', 'November': 'Kasım', 'December': 'Aralık'
    };
    
    const parts = dateStr.split(' ');
    if (parts.length >= 2) {
      const day = parts[0];
      const month = months[parts[1]] || parts[1];
      return `${day} ${month}`;
    }
    
    return dateStr;
  }

  onLogout() {
    this.authService.logout().subscribe({
      next: () => {
        window.location.href = '/login?role=student';
      },
      error: (error) => {
        console.error('Logout error:', error);
        window.location.href = '/login?role=student';
      }
    });
  }
}


