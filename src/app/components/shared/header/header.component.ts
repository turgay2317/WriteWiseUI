import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppStateService } from '../../../services/core/app-state.service';
import { ToastService } from '../../../services/core/toast.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="appbar">
      <div class="appbar-inner">
        <!-- Logo ve Başlık -->
        <div class="flex items-center gap-3">
          <div class="h-10 w-10 rounded-xl bg-gradient-to-br from-sage via-warmGreen to-sage grid place-items-center text-white shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          <div class="hidden md:block">
            <h1 class="text-lg font-bold text-espresso">{{ panelTitle || 'Öğretmen Paneli' }}</h1>
            <p class="text-sm font-semibold bg-gradient-to-r from-warmGreen to-emerald-600 bg-clip-text text-transparent">{{ subtitle || 'Write Wise Eğitim Platformu' }}</p>
          </div>
        </div>

        <!-- Sağ Taraf Aksiyonlar -->
        <div class="ml-auto flex items-center gap-3">
          <!-- Bildirimler -->
          <button class="relative p-2 rounded-lg hover:bg-sage/10 transition-colors" aria-label="Bildirimler">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-mediumText">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            <span class="absolute top-2 right-2 h-2 w-2 rounded-full bg-warmGreen animate-pulse"></span>
          </button>

          <!-- Profil Avatarı -->
          <div class="flex items-center gap-3 pl-3 border-l border-sage/20">
            <div class="h-10 w-10 rounded-full bg-gradient-to-br from-sage via-warmGreen to-coolGray grid place-items-center text-white text-sm font-bold shadow-md ring-2 ring-sage/20">
              {{ userInitials || 'BS' }}
            </div>
            <div class="hidden md:block mr-2">
              <p class="text-sm font-semibold text-espresso">{{ userName || 'Bertan Sezgin' }}</p>
              <p class="text-xs text-emerald-600 font-medium">{{ userRole || 'Öğretmen' }}</p>
            </div>
          </div>

          <!-- Çıkış Butonu -->
          <button class="btn btn-secondary gap-2 group" (click)="onLogout()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-mediumText group-hover:text-sage transition-colors">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            <span>Çıkış</span>
          </button>
        </div>
      </div>
    </header>
  `
})
export class HeaderComponent {
  @Output() logoutClick = new EventEmitter<void>();
  @Input() panelTitle?: string;
  @Input() subtitle?: string;
  @Input() userName?: string;
  @Input() userInitials?: string;
  @Input() userRole?: string;

  constructor(
    public appState: AppStateService,
    private toastService: ToastService
  ) {}

  onLogout() {
    this.logoutClick.emit();
  }
}
