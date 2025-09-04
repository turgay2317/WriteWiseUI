import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HeroScrollSceneComponent } from '../../hero/hero.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, HeroScrollSceneComponent],
  template: `
    <!-- Ana Landing Page -->
    <main class="landing-page">
      
      <!-- Hero Section with Scroll Animation -->
      <app-hero-scroll-scene 
        [posterSrc]="'assets/poster.svg'"
        (ctaPrimaryClick)="onGetStarted()"
        (ctaSecondaryClick)="onWatchDemo()">
      </app-hero-scroll-scene>

      <!-- Features Section -->
      <section class="features-section">
        <div class="container">
          <div class="features-grid">
            
            <div class="feature-card">
              <div class="feature-icon" [style.background-color]="'#80b48c'">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <h3>Akıllı Değerlendirme</h3>
              <p>Yapay zeka destekli otomatik değerlendirme sistemi ile öğrenci performansını anında analiz edin.</p>
            </div>

            <div class="feature-card">
              <div class="feature-icon" [style.background-color]="'#a0bfb9'">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M2 3h20v2H2zM2 7h20v2H2zM2 11h20v2H2zM2 15h20v2H2zM2 19h20v2H2z"/>
                </svg>
              </div>
              <h3>Sınıf Yönetimi</h3>
              <p>Tüm sınıflarınızı tek platformda yönetin, öğrenci ilerlemelerini takip edin.</p>
            </div>

            <div class="feature-card">
              <div class="feature-icon" [style.background-color]="'#c0cfd0'">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14,2 14,8 20,8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <polyline points="10,9 9,9 8,9"/>
                </svg>
              </div>
              <h3>Kolay Sınav Yükleme</h3>
              <p>Çeşitli formatlarda sınav yükleyin, otomatik işleme ile sonuçları dakikalar içinde alın.</p>
            </div>

          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="cta-section">
        <div class="container">
          <div class="cta-content">
            <h2>Eğitimde Yeni Dönem Başlıyor</h2>
            <p>Öğretmenler için tasarlanmış, öğrenciler için optimize edilmiş platform ile eğitimin geleceğini deneyimleyin.</p>
            
            <div class="cta-buttons">
              <button class="cta-btn cta-btn-primary" (click)="onGetStarted()">
                <span>Hemen Başlayın</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
              
              <button class="cta-btn cta-btn-secondary" (click)="onContactUs()">
                <span>İletişime Geçin</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="landing-footer">
        <div class="container">
          <div class="footer-content">
            <div class="footer-brand">
              <div class="footer-logo">
                <div class="logo-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3 6 6 .9-4.5 4.3 1.1 6.3L12 16.9 6.4 19.5l1.1-6.3L3 8.9 9 8z"/>
                  </svg>
                </div>
                <span>EduTech Platform</span>
              </div>
              <p>Doğal öğrenme deneyimi için tasarlanan akıllı eğitim araçları.</p>
            </div>
            
            <div class="footer-links">
              <div class="footer-section">
                <h4>Platform</h4>
                <a href="#" (click)="onGetStarted()">Öğretmen Paneli</a>
                <a href="#" (click)="onWatchDemo()">Demo</a>
                <a href="#">Özellikler</a>
              </div>
              
              <div class="footer-section">
                <h4>Destek</h4>
                <a href="#" (click)="onContactUs()">İletişim</a>
                <a href="#">Yardım</a>
                <a href="#">Dokümantasyon</a>
              </div>
            </div>
          </div>
          
          <div class="footer-bottom">
            <p>&copy; 2025 EduTech Platform. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>

    </main>
  `,
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent {
  constructor(private router: Router) {}

  onGetStarted(): void {
    // Öğretmen paneline yönlendir
    this.router.navigate(['/dashboard']);
  }

  onWatchDemo(): void {
    // Demo modal açabilir veya demo sayfasına gidebilir
    console.log('Demo izleme tıklandı');
    // Modal implementation veya video player
  }

  onContactUs(): void {
    // İletişim sayfasına yönlendir veya modal aç
    console.log('İletişim tıklandı');
    // this.router.navigate(['/contact']);
  }
}
