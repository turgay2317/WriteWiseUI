import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../../components/shared/footer/footer.component';

@Component({
  selector: 'app-features',
  standalone: true,
  imports: [CommonModule, FooterComponent],
  template: `
    <section class="features-hero">
      <div class="container">
        <h1 class="title">Özellikler</h1>
        <p class="subtitle">WriteWise platformunun sunduğu yeteneklere yakından bakın.</p>
      </div>
    </section>

    <section class="features-expanded">
      <div class="container">
        <div class="features-featured">
          <article class="feature-hero-card">
            <div class="feature-hero-content">
              <h3 class="feature-hero-title">Akıllı Değerlendirme Motoru</h3>
              <p class="feature-hero-text">Yanıtları anında işleyen, ölçütlere göre puanlayan ve geliştirici geri bildirimler oluşturan değerlendirme altyapısı.</p>
              <div class="feature-hero-meta">
                <span class="badge">%3.5x hız</span>
                <span class="badge badge-outline">Tutarlı ölçme</span>
              </div>
            </div>
            <div class="feature-visual-wrap">
              <img src="assets/poster.svg" alt="Değerlendirme görseli" class="feature-visual"/>
            </div>
          </article>

          <article class="feature-hero-card alt">
            <div class="feature-hero-content">
              <h3 class="feature-hero-title">Sınıf Analitiği ve Yönetim</h3>
              <p class="feature-hero-text">İlerlemeyi izleyin, eğilimleri görün ve hedefli aksiyonlar alın.</p>
              <div class="feature-hero-meta">
                <span class="badge">Gerçek zamanlı</span>
              </div>
            </div>
            <div class="feature-visual-wrap small">
              <img src="assets/graduation-cap.svg" alt="Analitik görseli" class="feature-visual"/>
            </div>
          </article>
        </div>

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

    <app-footer></app-footer>
  `,
  styleUrls: ['./features.component.scss']
})
export class FeaturesComponent {}


