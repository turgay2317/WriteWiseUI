import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

export const routes: Routes = [
  // Ana sayfa - Landing page
  { 
    path: '', 
    component: LandingComponent,
    title: 'EduTech Platform - Eğitim Teknolojilerinin Geleceği'
  },
  
  // Öğretmen Dashboard
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    title: 'Öğretmen Paneli - EduTech Platform'
  },
  
  // Bilinmeyen route'lar için ana sayfaya yönlendir
  { 
    path: '**', 
    redirectTo: '' 
  }
];
