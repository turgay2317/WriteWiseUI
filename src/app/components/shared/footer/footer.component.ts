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
                <img src="assets/logo.png" alt="WriteWise Logo" class="w-8 h-8 object-contain">
              </div>
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
          <p>&copy; 2025 WriteWise. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  `,
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {}


