import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HeroScrollSceneComponent } from '../../components/shared/hero/hero.component';
import { FooterComponent } from '../../components/shared/footer/footer.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule, HeroScrollSceneComponent, FooterComponent],
  template: `
    <!-- Ana Landing Page -->
    <main class="landing-page">
      
      <!-- Hero Section with Scroll Animation -->
      <app-hero-scroll-scene 
        [posterSrc]="'assets/poster.svg'"
        (ctaPrimaryClick)="onGetStarted()"
        (ctaSecondaryClick)="onWatchDemo()"
        (onRegisterClick)="onRegister()"
        (pricingClick)="onPricing()"
        (featuresClick)="onFeatures()"
        (contactClick)="onContactUs()"
        (docsClick)="onDocs()">
      </app-hero-scroll-scene>

      <!-- Hero içindeki topbar'a taşındı -->

      <!-- Features Section -->
      <section class="features-section" id="features">
        <div class="container">
          <div class="features-header">
            <h2>Özellikler</h2>
          </div>

          <!-- Featured row (removed per request) -->

          <!-- All features grid -->
          <h3 class="features-subtitle">Tüm Özellikler</h3>
          <div class="features-grid">
            <div class="feature-card">
              <div class="feature-icon" [style.background-color]="'#80b48c'">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <h3>Akıllı Değerlendirme</h3>
              <p>Yapay zeka destekli otomatik değerlendirme ile net ve hızlı sonuçlar.</p>
            </div>

            <div class="feature-card">
              <div class="feature-icon" [style.background-color]="'#a0bfb9'">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M2 3h20v2H2zM2 7h20v2H2zM2 11h20v2H2zM2 15h20v2H2zM2 19h20v2H2z"/>
                </svg>
              </div>
              <h3>Sınıf Yönetimi</h3>
              <p>Tüm sınıflarınızı tek panelde yönetin, görevleri düzenleyin.</p>
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
              <p>PDF ya da görselleri yükleyin, sistem saniyeler içinde işler.</p>
            </div>

            <div class="feature-card">
              <div class="feature-icon" [style.background-color]="'#80b48c'">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
              </div>
              <h3>Rubrik Desteği</h3>
              <p>Özelleştirilebilir rubriklerle adil ve şeffaf değerlendirme.</p>
            </div>

            <div class="feature-card">
              <div class="feature-icon" [style.background-color]="'#a0bfb9'">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 12h18"/>
                  <path d="M12 3v18"/>
                </svg>
              </div>
              <h3>Çoklu Sınıf</h3>
              <p>Birden fazla sınıfı aynı anda ve düzenli biçimde yönetin.</p>
            </div>

            <div class="feature-card">
              <div class="feature-icon" [style.background-color]="'#c0cfd0'">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c0 .66.26 1.3.73 1.77.47.47 1.11.73 1.77.73"/>
                </svg>
              </div>
              <h3>Entegrasyonlar</h3>
              <p>Okul sistemleri ve bulut depolama hizmetleriyle uyumlu çalışır.</p>
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

              <button class="cta-btn cta-btn-secondary" (click)="onDocs()">
                <span>Dokümantasyon</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <app-footer></app-footer>

    </main>
  `,
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent {
  constructor(private router: Router) {}

  onGetStarted(): void {
    // Öğretmen girişi
    this.router.navigate(['/login'], { queryParams: { role: 'teacher' } });
  }

  onWatchDemo(): void {
    // Öğrenci girişi
    this.router.navigate(['/login'], { queryParams: { role: 'student' } });
  }

  onContactUs(): void {
    this.router.navigate(['/iletisim']);
  }

  onPricing(): void {
    this.router.navigate(['/pricing']);
  }

  onRegister(): void {
    // Kayıt sayfasına yönlendir
    this.router.navigate(['/register']);
  }

  onFeatures(): void {
    // Ayrı Özellikler sayfasına yönlendir
    this.router.navigate(['/features']);
  }

  onDocs(): void {
    this.router.navigate(['/dokumantasyon']);
  }
}
