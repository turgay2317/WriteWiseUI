import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
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
              <span>Write Wise</span>
            </div>
            <p>Doğal öğrenme deneyimi için tasarlanan akıllı eğitim araçları.</p>
          </div>
          
          <div class="footer-links">
            <div class="footer-section">
              <h4>Platform</h4>
              <a routerLink="/pricing">Fiyatlandırma</a>
              <a routerLink="/features">Özellikler</a>
              <a routerLink="/iletisim">İletişim</a>
            </div>
            
            <div class="footer-section">
              <h4>Destek</h4>
              <a routerLink="/iletisim">İletişim</a>
              <a routerLink="/dokumantasyon">Dokümantasyon</a>
              
            </div>
          </div>
        </div>
        
        <div class="footer-bottom">
          <p>&copy; 2025 Write Wise. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  `,
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {}


