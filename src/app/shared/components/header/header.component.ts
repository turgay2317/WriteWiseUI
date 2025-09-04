import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppStateService } from '../../../core/services/app-state.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="appbar">
      <div class="appbar-inner">
        <div class="flex items-center gap-2 mr-2">
          <div class="h-8 w-8 rounded-lg bg-primary/10 grid place-items-center text-primary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3 6 6 .9-4.5 4.3 1.1 6.3L12 16.9 6.4 19.5l1.1-6.3L3 8.9 9 8z"/>
            </svg>
          </div>
        </div>

        <div class="hidden md:flex items-center gap-2 ml-2">
          <span class="text-borderGray">—</span>
        </div>

        <button class="ml-auto btn btn-ghost" aria-label="Bildirimler">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 24a2.5 2.5 0 002.45-2h-4.9A2.5 2.5 0 0012 24zm6.36-6V11a6.36 6.36 0 10-12.72 0v7L3 19v1h18v-1l-2.64-1z"/>
          </svg>
        </button>

        <div class="h-8 w-8 rounded-full bg-infoSurface border border-borderGray grid place-items-center text-espresso text-xs font-semibold select-none">BS</div>
        <button class="btn btn-secondary ml-2" (click)="onLogout()">Çıkış</button>
      </div>
    </header>
  `
})
export class HeaderComponent {
  @Output() logoutClick = new EventEmitter<void>();

  constructor(
    public appState: AppStateService,
    private toastService: ToastService
  ) {}

  onLogout() {
    this.logoutClick.emit();
  }
}
