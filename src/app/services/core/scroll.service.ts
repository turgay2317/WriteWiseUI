import { Injectable, signal } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// GSAP plugin'ini register et
gsap.registerPlugin(ScrollTrigger);

export interface ScrollSceneConfig {
  trigger: string | HTMLElement;
  start?: string;
  end?: string;
  pin?: boolean;
  pinElement?: Element; // İkinci sahne için farklı element pinlemek için
  scrub?: boolean | number;
  onUpdate?: (progress: number) => void;
  markers?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ScrollService {
  private scrollTriggers: ScrollTrigger[] = [];
  private reducedMotion = signal(false);

  constructor() {
    // Reduced motion preference'ı kontrol et
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      this.reducedMotion.set(mediaQuery.matches);
      
      mediaQuery.addEventListener('change', (e) => {
        this.reducedMotion.set(e.matches);
      });
    }
  }

  get isReducedMotion() {
    return this.reducedMotion();
  }

  /**
   * Scroll-scrubbing scene oluştur
   */
  createScrollScene(config: ScrollSceneConfig): ScrollTrigger {
    const trigger = ScrollTrigger.create({
      trigger: config.trigger,
      start: config.start || 'top top',
      end: config.end || '+=2500',
      pin: config.pin ? (config.pinElement || config.trigger) : false,
      scrub: config.scrub !== undefined ? config.scrub : true,
      markers: config.markers || false,
      onUpdate: (self) => {
        if (config.onUpdate) {
          config.onUpdate(self.progress);
        }
      }
    });

    this.scrollTriggers.push(trigger);
    return trigger;
  }

  /**
   * Belirli bir ScrollTrigger'ı temizle
   */
  killScrollTrigger(trigger: ScrollTrigger): void {
    const index = this.scrollTriggers.indexOf(trigger);
    if (index > -1) {
      trigger.kill();
      this.scrollTriggers.splice(index, 1);
    }
  }

  /**
   * Tüm ScrollTrigger'ları temizle
   */
  killAllScrollTriggers(): void {
    this.scrollTriggers.forEach(trigger => trigger.kill());
    this.scrollTriggers = [];
  }

  /**
   * ScrollTrigger'ları yenile (layout değişikliklerinde)
   */
  refreshScrollTriggers(): void {
    ScrollTrigger.refresh();
  }

  /**
   * Smooth değer interpolasyonu için yardımcı
   */
  interpolate(start: number, end: number, progress: number): number {
    return start + (end - start) * progress;
  }

  /**
   * Easing fonksiyonları
   */
  easing = {
    easeOutQuart: (t: number): number => 1 - Math.pow(1 - t, 4),
    easeInOutCubic: (t: number): number => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
    easeInCubic: (t: number): number => t * t * t,
    easeOutCubic: (t: number): number => 1 - Math.pow(1 - t, 3),
    easeOutBack: (t: number): number => {
      const c1 = 1.70158;
      const c3 = c1 + 1;
      return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    }
  };
}
