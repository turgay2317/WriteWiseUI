import { Injectable, effect, signal } from '@angular/core';
import { ModuleKey } from '../../models';

@Injectable({
  providedIn: 'root'
})
export class AppStateService {
  // Global state
  private darkModeSignal = signal(false);
  private globalQuerySignal = signal('');
  private dateStartSignal = signal<string>('');
  private dateEndSignal = signal<string>('');
  
  // Module expansion
  private expandedModuleSignal = signal<ModuleKey | null>(null);

  // Getters
  get darkMode() { return this.darkModeSignal; }
  get globalQuery() { return this.globalQuerySignal; }
  get dateStart() { return this.dateStartSignal; }
  get dateEnd() { return this.dateEndSignal; }
  get expandedModule() { return this.expandedModuleSignal; }

  constructor() {
    // Dark mode effect
    effect(() => {
      if (this.darkModeSignal()) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    });
  }

  // Actions
  toggleDarkMode() {
    this.darkModeSignal.update(dark => !dark);
  }

  setGlobalQuery(query: string) {
    this.globalQuerySignal.set(query);
  }

  setDateRange(start: string, end: string) {
    this.dateStartSignal.set(start);
    this.dateEndSignal.set(end);
  }

  expandCard(key: ModuleKey) {
    this.expandedModuleSignal.set(key);
  }

  collapseAll() {
    this.expandedModuleSignal.set(null);
  }

  // Quadrant helpers
  getOriginClass(key: ModuleKey | null): string {
    switch (key) {
      case 'ogrenciler': return 'origin-top-left';
      case 'sinif-ozet': return 'origin-top-right';
      case 'sinav-yukle': return 'origin-bottom-left';
      case 'yuklemeler': return 'origin-bottom-right';
      default: return 'origin-center';
    }
  }

  getTileStyle(key: ModuleKey) {
    const base = { position: 'absolute' as const };
    if (key === 'ogrenciler') return { ...base, top: '12px', left: '12px' };
    if (key === 'sinif-ozet') return { ...base, top: '12px', right: '12px' };
    if (key === 'sinav-yukle') return { ...base, bottom: '12px', left: '12px' };
    return { ...base, bottom: '12px', right: '12px' };
  }
}
