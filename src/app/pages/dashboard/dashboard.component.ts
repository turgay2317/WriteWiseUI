import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

// Services
import { AppStateService } from '../../services/core/app-state.service';
import { StudentApiService } from '../../services/api/student-api.service';
import { ClassApiService } from '../../services/api/class-api.service';
import { ExamApiService } from '../../services/api/exam-api.service';
import { ToastService } from '../../services/core/toast.service';

// Components
import { HeaderComponent } from '../../components/shared/header/header.component';
import { ToastComponent } from '../../components/shared/toast/toast.component';
import { StudentListComponent } from '../../components/features/student-list/student-list.component';
import { ClassSummaryComponent } from '../../components/features/class-summary/class-summary.component';
import { ExamUploadComponent } from '../../components/features/exam-upload/exam-upload.component';
import { ClassesSubjectsComponent } from '../../components/features/classes-subjects/classes-subjects.component';
import { ClassManagementComponent } from '../../components/features/class-management/class-management.component';

// Types
import { ModuleKey } from '../../models';

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
    ClassesSubjectsComponent,
    ClassManagementComponent
  ],
  template: `
    <!-- Dashboard Header -->
    <app-header (logoutClick)="onLogout()"></app-header>
    
    <!-- Dashboard Main Content -->
    <main class="layout-container mx-auto max-w-7xl px-4 lg:px-8 py-2">
      <!-- Welcome Section -->
      <div class="welcome-section mb-3 lg:mb-4 text-center" *ngIf="!appState.expandedModule()">
        <div class="inline-block">
          <h1 class="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-sage via-warmGreen to-sage bg-clip-text text-transparent mb-1 lg:mb-2">
            Hoş Geldiniz!
          </h1>
          <p class="text-sm lg:text-base text-mediumText max-w-md mx-auto leading-relaxed">
            Sınıflarınızı yönetmek için aşağıdaki modüllerden birini seçin
          </p>
        </div>
      </div>
      
      <div class="relative h-[calc(100vh-5rem)] overflow-hidden">
        
        <!-- Landing grid -->
        <section *ngIf="!appState.expandedModule()" class="responsive-grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 h-[500px] lg:h-[550px] max-w-7xl mx-auto">
          
          <!-- Öğrenciler Card -->
          <div class="dashboard-card group relative overflow-hidden transition-all duration-300 hover:scale-[1.02]" 
               (click)="expandCard('ogrenciler')">
            
            <!-- Background Gradient -->
            <div class="absolute inset-0 bg-gradient-to-br from-sage/90 to-warmGreen/80"></div>
            <div class="absolute inset-0 bg-gradient-to-br from-black/20 to-black/40 group-hover:from-black/10 group-hover:to-black/30 transition-all duration-300"></div>
            
            <!-- Content Overlay -->
            <div class="relative z-10 p-6 h-full flex flex-col items-center justify-center text-white">
              <div class="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur-sm grid place-items-center text-white transition-all duration-300 group-hover:scale-110 group-hover:bg-white/30 mb-6">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <h3 class="text-xl lg:text-2xl font-bold text-white">Öğrenciler</h3>
            </div>
          </div>

          <!-- Sınıf Durumu Card -->
          <div class="dashboard-card group relative overflow-hidden transition-all duration-300 hover:scale-[1.02]" 
               (click)="expandCard('sinif-ozet')">
            
            <!-- Background Gradient -->
            <div class="absolute inset-0 bg-gradient-to-br from-coolGray/90 to-slate-600/80"></div>
            <div class="absolute inset-0 bg-gradient-to-br from-black/20 to-black/40 group-hover:from-black/10 group-hover:to-black/30 transition-all duration-300"></div>
            
            <!-- Content Overlay -->
            <div class="relative z-10 p-6 h-full flex flex-col items-center justify-center text-white">
              <div class="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur-sm grid place-items-center text-white transition-all duration-300 group-hover:scale-110 group-hover:bg-white/30 mb-6">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M3 3v18h18"/>
                  <path d="M18 17V9"/>
                  <path d="M13 17V5"/>
                  <path d="M8 17v-3"/>
                </svg>
              </div>
              <h3 class="text-xl lg:text-2xl font-bold text-white">Sınıf Durumu</h3>
            </div>
          </div>

          <!-- Sınav Yükle Card -->
          <div class="dashboard-card group relative overflow-hidden transition-all duration-300 hover:scale-[1.02]" 
               (click)="expandCard('sinav-yukle')">
            
            <!-- Background Gradient -->
            <div class="absolute inset-0 bg-gradient-to-br from-warmGreen/90 to-emerald-600/80"></div>
            <div class="absolute inset-0 bg-gradient-to-br from-black/20 to-black/40 group-hover:from-black/10 group-hover:to-black/30 transition-all duration-300"></div>
            
            <!-- Content Overlay -->
            <div class="relative z-10 p-6 h-full flex flex-col items-center justify-center text-white">
              <div class="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur-sm grid place-items-center text-white transition-all duration-300 group-hover:scale-110 group-hover:bg-white/30 mb-6">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
              </div>
              <h3 class="text-xl lg:text-2xl font-bold text-white">Sınav Yükle</h3>
            </div>
          </div>

         
          <!-- Sınıflar/Dersler Card -->
          <div class="dashboard-card group relative overflow-hidden transition-all duration-300 hover:scale-[1.02]" 
               (click)="expandCard('siniflar-dersler')">
            
            <!-- Background Gradient -->
            <div class="absolute inset-0 bg-gradient-to-br from-slate-700/90 to-gray-800/80"></div>
            <div class="absolute inset-0 bg-gradient-to-br from-black/20 to-black/40 group-hover:from-black/10 group-hover:to-black/30 transition-all duration-300"></div>
            
            <!-- Content Overlay -->
            <div class="relative z-10 p-6 h-full flex flex-col items-center justify-center text-white">
              <div class="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur-sm grid place-items-center text-white transition-all duration-300 group-hover:scale-110 group-hover:bg-white/30 mb-6">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                  <path d="M8 7h8"/>
                  <path d="M8 11h8"/>
                  <path d="M8 15h5"/>
                </svg>
              </div>
              <h3 class="text-xl lg:text-2xl font-bold text-white">Sınıflar/Dersler</h3>
            </div>
          </div>
        </section>

        <!-- Expanded Module Views -->
        <section *ngIf="appState.expandedModule()" class="absolute inset-x-4 top-4 bottom-[60px]">
          <div class="card p-0 w-full animate-slide-in relative h-full" 
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

            <!-- Sınıflarım Module -->
            <app-class-management *ngIf="appState.expandedModule() === 'siniflarim'">
            </app-class-management>

            <!-- Sınıflar/Dersler Module -->  
            <app-classes-subjects *ngIf="appState.expandedModule() === 'siniflar-dersler'">
            </app-classes-subjects>
            
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
    private studentService: StudentApiService,
    private classSummaryService: ClassApiService,
    private uploadedExamService: ExamApiService,
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
    } else if (key === 'sinav-yukle') {
      // Sınav yükleme modülü için reset işlemi
    } else if (key === 'siniflarim') {
      // Sınıflarım modülü için reset işlemi
    } else if (key === 'siniflar-dersler') {
      // Sınıflar/Dersler modülü için reset işlemi
    }
  }

  onLogout() {
    // Logout işlemi - landing page'e yönlendir
    this.toastService.logout();
    this.appState.collapseAll();
    
    // AuthApiService logout method'unu çağır
    // this.authService.logout().subscribe(); // Eğer backend'e logout request göndermek istiyorsak
    
    // Ana sayfaya (landing) geri dön
    this.router.navigate(['/']);
  }
}
