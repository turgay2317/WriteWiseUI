import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { PricingComponent } from './pages/pricing/pricing.component';
import { FeaturesComponent } from './pages/features/features.component';
import { LoginComponent } from './pages/login/login.component';
import { StudentPageComponent } from './pages/student/student-page.component';
import { ContactComponent } from './pages/contact/contact.component';
import { DocsComponent } from './pages/docs/docs.component';
import { QuestionAnalysisComponent } from './components/features/question-analysis/question-analysis.component';

export const routes: Routes = [
  // Ana sayfa - Landing page
  { 
    path: '', 
    component: LandingComponent,
    title: 'WriteWise - Eğitim Teknolojilerinin Geleceği'
  },
  
  // Öğretmen Dashboard
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    title: 'Öğretmen Paneli - WriteWise'
  },
  
  // Fiyatlandırma sayfası
  { 
    path: 'pricing', 
    component: PricingComponent,
    title: 'Fiyatlandırma - WriteWise'
  },
  
  
  // Giriş sayfası
  { 
    path: 'login', 
    component: LoginComponent,
    title: 'Giriş Yap - WriteWise'
  },

  // Öğrenci portalı
  {
    path: 'ogrenci',
    component: StudentPageComponent,
    title: 'Öğrenci Paneli - Sınavlarım'
  },

  // İletişim sayfası
  {
    path: 'iletisim',
    component: ContactComponent,
    title: 'İletişim - WriteWise'
  },

  // Dokümantasyon sayfası
  {
    path: 'dokumantasyon',
    component: DocsComponent,
    title: 'Dokümantasyon - WriteWise'
  },

  // Özellikler sayfası
  {
    path: 'features',
    component: FeaturesComponent,
    title: 'Özellikler - WriteWise'
  },

  // Soru analiz sayfası
  {
    path: 'sinav/:sinavId/soru/:soruNo',
    component: QuestionAnalysisComponent,
    title: 'Soru Analizi - WriteWise'
  },
  
  // Öğrenci Girişi (farazi - gelecekte implement edilecek)
  { 
    path: 'student-login', 
    component: LandingComponent, // Geçici olarak landing'e yönlendir
    title: 'Öğrenci Girişi - WriteWise'
  },
  
  // Bilinmeyen route'lar için ana sayfaya yönlendir
  { 
    path: '**', 
    redirectTo: '' 
  }
];
