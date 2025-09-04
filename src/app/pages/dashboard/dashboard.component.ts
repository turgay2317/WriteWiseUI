import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

// Services
import { AppStateService } from '../../core/services/app-state.service';
import { StudentService } from '../../core/services/student.service';
import { ClassSummaryService } from '../../core/services/class-summary.service';
import { UploadedExamService } from '../../core/services/uploaded-exam.service';
import { ToastService } from '../../core/services/toast.service';

// Components
import { HeaderComponent } from '../../shared/components/header/header.component';
import { ToastComponent } from '../../shared/components/toast/toast.component';
import { StudentListComponent } from '../../features/students/student-list.component';
import { ClassSummaryComponent } from '../../features/class-summary/class-summary.component';
import { ExamUploadComponent } from '../../features/exam-upload/exam-upload.component';
import { UploadedExamsComponent } from '../../features/uploaded-exams/uploaded-exams.component';

// Types
import { ModuleKey } from '../../core/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    ToastComponent,
    StudentListComponent,
    ClassSummaryComponent,
    ExamUploadComponent,
    UploadedExamsComponent
  ],
  template: `
    <!-- Dashboard Header -->
    <app-header (logoutClick)="onLogout()"></app-header>
    
    <!-- Dashboard Main Content -->
    <main class="layout-container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
      <div class="relative h-[calc(100vh-4rem)] overflow-hidden">
        
        <!-- Landing 2×2 grid -->
        <section *ngIf="!appState.expandedModule()" class="responsive-grid grid-cols-1 md:grid-cols-2 grid-rows-2 gap-4 h-[70vh] max-w-4xl mx-auto">
          
          <!-- Öğrenciler Card -->
          <button class="card p-4 text-left" (click)="expandCard('ogrenciler')">
            <div class="flex items-center justify-between">
              <div class="h-10 w-10 rounded-xl bg-infoSurface grid place-items-center text-espresso">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12a5 5 0 10-5-5 5 5 0 005 5zm-7 9a7 7 0 0114 0z"/>
                </svg>
              </div>
              <div class="text-xs text-espresso/50">▶</div>
            </div>
            <h3 class="mt-3 text-lg font-semibold text-espresso">Öğrenciler</h3>
            <p class="mt-1 text-sm text-espresso/70">Liste ve sınavlar.</p>
          </button>

          <!-- Sınıfların Genel Durumu Card -->
          <button class="card p-4 text-left" (click)="expandCard('sinif-ozet')">
            <div class="flex items-center justify-between">
              <div class="h-10 w-10 rounded-xl bg-infoSurface grid place-items-center text-espresso">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 3h18v4H3zm0 7h18v4H3zm0 7h18v4H3z"/>
                </svg>
              </div>
              <div class="text-xs text-espresso/50">▶</div>
            </div>
            <h3 class="mt-3 text-lg font-semibold text-espresso">Sınıfların Genel Durumu</h3>
            <p class="mt-1 text-sm text-espresso/70">Özet ve trendler.</p>
          </button>

          <!-- Sınav Yükle Card -->
          <button class="card p-4 text-left" (click)="expandCard('sinav-yukle')">
            <div class="flex items-center justify-between">
              <div class="h-10 w-10 rounded-xl bg-infoSurface grid place-items-center text-espresso">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13 5V2h-2v3H8l4-4 4 4h-3zm-7 4h12v11H6z"/>
                </svg>
              </div>
              <div class="text-xs text-espresso/50">▶</div>
            </div>
            <h3 class="mt-3 text-lg font-semibold text-espresso">Sınav Yükle</h3>
            <p class="mt-1 text-sm text-espresso/70">Dosya seçin.</p>
          </button>

          <!-- Yüklediğim Sınavlar Card -->
          <button class="card p-4 text-left" (click)="expandCard('yuklemeler')">
            <div class="flex items-center justify-between">
              <div class="h-10 w-10 rounded-xl bg-infoSurface grid place-items-center text-espresso">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4 4h16v2H4zm0 4h10v2H4zm0 4h16v2H4zm0 4h12v2H4z"/>
                </svg>
              </div>
              <div class="text-xs text-espresso/50">▶</div>
            </div>
            <h3 class="mt-3 text-lg font-semibold text-espresso">Yüklediğim Sınavlar</h3>
            <p class="mt-1 text-sm text-espresso/70">Durum ve raporlar.</p>
          </button>
        </section>

        <!-- Expanded Module Views -->
        <section *ngIf="appState.expandedModule()" class="absolute inset-0 overflow-hidden">
          <div class="card p-0 h-full w-full animate-slide-in relative overflow-hidden" 
               [ngClass]="appState.getOriginClass(appState.expandedModule())">
            
            <!-- Öğrenciler Module -->
            <app-student-list *ngIf="appState.expandedModule() === 'ogrenciler'">
            </app-student-list>

            <!-- Sınıf Özeti Module -->
            <app-class-summary *ngIf="appState.expandedModule() === 'sinif-ozet'">
            </app-class-summary>

            <!-- Sınav Yükleme Module -->
            <app-exam-upload *ngIf="appState.expandedModule() === 'sinav-yukle'">
            </app-exam-upload>

            <!-- Yüklenen Sınavlar Module -->  
            <app-uploaded-exams *ngIf="appState.expandedModule() === 'yuklemeler'">
            </app-uploaded-exams>
            
          </div>
        </section>
        
      </div>
    </main>

    <!-- Dashboard Toast Notifications -->
    <app-toast></app-toast>
  `,
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  constructor(
    public appState: AppStateService,
    private studentService: StudentService,
    private classSummaryService: ClassSummaryService,
    private uploadedExamService: UploadedExamService,
    public toastService: ToastService,
    private router: Router
  ) {}

  expandCard(key: ModuleKey) {
    this.appState.expandCard(key);
    
    // Reset states for specific modules
    if (key === 'ogrenciler') {
      this.studentService.resetStudentModule();
    } else if (key === 'sinif-ozet') {
      this.classSummaryService.resetClassSummary();
    } else if (key === 'yuklemeler') {
      this.uploadedExamService.resetUploadedExams();
    }
  }

  onLogout() {
    // Logout işlemi - landing page'e yönlendir
    this.toastService.logout();
    this.appState.collapseAll();
    
    // Ana sayfaya (landing) geri dön
    this.router.navigate(['/']);
  }
}
