import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { PricingComponent } from './pages/pricing/pricing.component';
import { RegisterComponent } from './pages/register/register.component';
import { FeaturesComponent } from './pages/features/features.component';
import { LoginComponent } from './pages/login/login.component';

export const routes: Routes = [
  // Ana sayfa - Landing page
  { 
    path: '', 
    component: LandingComponent,
    title: 'Write Wise  - Eğitim Teknolojilerinin Geleceği'
  },
  
  // Öğretmen Dashboard
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    title: 'Öğretmen Paneli - Write Wise  '
  },
  
  // Fiyatlandırma sayfası
  { 
    path: 'pricing', 
    component: PricingComponent,
    title: 'Fiyatlandırma - Write Wise  '
  },
  
  // Kayıt sayfası
  { 
    path: 'register', 
    component: RegisterComponent,
    title: 'Kayıt Ol - Write Wise  '
  },
  
  // Giriş sayfası
  { 
    path: 'login', 
    component: LoginComponent,
    title: 'Giriş Yap - Write Wise  '
  },

  // Özellikler sayfası
  {
    path: 'features',
    component: FeaturesComponent,
    title: 'Özellikler - Write Wise  '
  },
  
  // Öğrenci Girişi (farazi - gelecekte implement edilecek)
  { 
    path: 'student-login', 
    component: LandingComponent, // Geçici olarak landing'e yönlendir
    title: 'Öğrenci Girişi - Write Wise  '
  },
  
  // Bilinmeyen route'lar için ana sayfaya yönlendir
  { 
    path: '**', 
    redirectTo: '' 
  }
];
