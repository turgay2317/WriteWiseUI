# Hero Scroll Scene Component

Eğitim teknolojileri landing page için scroll-scrubbing animasyonlu hero bölümü.

## Özellikler

- **Dual Mode**: Video + Canvas fallback
- **Scroll-Scrubbing**: GSAP ScrollTrigger ile senkronize animasyon
- **Accessibility**: Screen reader uyumlu, reduced motion desteği
- **Responsive**: Mobil-first tasarım
- **Performance**: 60fps hedef, retina optimizasyonu

## Kullanım

### Temel Kullanım (Canvas Mode)
```html
<app-hero-scroll-scene></app-hero-scroll-scene>
```

### Video Mode ile
```html
<app-hero-scroll-scene 
  [videoSrcMp4]="'assets/hero.mp4'"
  [videoSrcWebm]="'assets/hero.webm'"
  [posterSrc]="'assets/poster.jpg'">
</app-hero-scroll-scene>
```

### Özelleştirilmiş Konfigürasyon
```html
<app-hero-scroll-scene 
  [videoSrcMp4]="'assets/hero.mp4'"
  [posterSrc]="'assets/poster.jpg'"
  [scrollLengthPx]="3000"
  [durationSec]="10"
  [pin]="true">
</app-hero-scroll-scene>
```

## Input Parametreleri

| Parametre | Tip | Varsayılan | Açıklama |
|-----------|-----|------------|----------|
| `videoSrcMp4` | string | undefined | MP4 video dosyası yolu |
| `videoSrcWebm` | string | undefined | WebM video dosyası yolu |
| `posterSrc` | string | 'assets/poster.jpg' | Poster/fallback görseli |
| `scrollLengthPx` | number | 2500 | Scroll trigger uzunluğu (px) |
| `durationSec` | number | 8 | Video süresi (saniye) |
| `pin` | boolean | true | Hero alanını pin etme |
| `colors` | object | HERO_COLORS | Renk paleti override |

## Renk Paleti

Brifte belirtilen renk paleti (değiştirilemez):

```typescript
export const HERO_COLORS = {
  sage: '#a0bfb9',        // Ana sage rengi
  coolGray: '#c0cfd0',    // Cool gray
  lightGray: '#f5f5f5',   // Light gray  
  white: '#ffffff',       // White
  warmGreen: '#80b48c'    // Warm green (accent/check)
} as const;
```

## Animasyon Timeline

| Progress | Aralık | Açıklama |
|----------|--------|----------|
| 0.00-0.20 | Dolly & Orbit | Yavaş dolly-in + <10° mikro orbit |
| 0.20-0.55 | Sweep | Soldan sağa yumuşak tarama geçişi |
| 0.55-0.80 | Alignment | Kağıtlar düzenli deste haline gelir |
| 0.80-0.92 | Circle & Check | Çember çizimi + onay işareti |
| 0.92-1.00 | Stabilize | Kompozisyon sabitlenir |

## Video Prodüksiyon Önerileri

### Veo/Runway İçin Ayarlar

**Teknik Spesifikasyonlar:**
- **Çözünürlük**: 1920x1080 (Full HD) veya 4K
- **Frame Rate**: 24-30fps 
- **Bitrate**: Yüksek (10-15 Mbps minimum)
- **Codec**: H.264 (MP4) + VP9 (WebM)
- **Motion Blur**: Düşük (keskin detaylar için)

**Görsel Yönergeler:**
- **Estetik**: Doğal, insanî, sınıf hissi
- **Işık**: Gün ışığı, mat yüzeyler
- **Kesinlikle HAYIR**: Neon/LED parıltısı, hologram, HUD, agresif teknoloji estetiği
- **Renk Sınırı**: Yalnızca brifte belirtilen 5 renk kullanın

**Sahne Kurgusu:**
1. **0-20%**: 4-6 A4 kağıt havada, soyut grafit çizgiler
2. **20-55%**: Soldan sağa "tarama" efekti (ışıksız)
3. **55-80%**: Kağıtlar temiz deste haline
4. **80-92%**: Çember çizimi + yeşil onay işareti
5. **92-100%**: Sakin stabilizasyon

## Mode Seçimi

### Video Mode
- `videoSrcMp4` veya `videoSrcWebm` tanımlıysa
- iOS autoplay kısıtları algılanırsa Canvas'a geçer
- `prefers-reduced-motion` aktifse devreye girmez

### Canvas Mode  
- Video yoksa veya video yüklenmezse
- Native 2D Canvas ile sahne render
- Retina display optimizasyonu
- Performance adaptive (düşük GPU'da degrade)

## Accessibility

- **Screen Readers**: Hero aria-hidden, content erişilebilir
- **Keyboard**: CTA butonları focus edilebilir  
- **Reduced Motion**: Statik poster + basit geçişler
- **High Contrast**: Kontrast modu desteği
- **Color Contrast**: WCAG AA uyumlu (4.5:1 minimum)

## Performance Optimizasyonları

- **Canvas**: requestAnimationFrame ile smooth render
- **Video**: Progressive loading, lazy initialization
- **Memory**: ScrollTrigger cleanup ngOnDestroy'da
- **CPU**: Progress değiştikçe selective render
- **GPU**: Hardware acceleration hints

## Browser Uyumluluğu

| Browser | Video Mode | Canvas Mode | ScrollTrigger |
|---------|------------|-------------|---------------|
| Chrome 90+ | ✅ | ✅ | ✅ |
| Firefox 88+ | ✅ | ✅ | ✅ |
| Safari 14+ | ⚠️ Kısıtlı | ✅ | ✅ |
| Edge 90+ | ✅ | ✅ | ✅ |
| iOS Safari | ⚠️ User gesture | ✅ | ✅ |

## Bilinen Kısıtlar

### iOS Video Autoplay
```typescript
// iOS detection ve fallback
if (video.readyState === 0) {
  console.warn('iOS autoplay kısıtı, Canvas moduna geçiliyor');
  this.mode.set('canvas');
}
```

### Düşük GPU Degrade
```typescript
// Performance monitoring
if (frameTime > 32) { // <30fps
  this.reduceQuality();
}
```

### Memory Management
```typescript
ngOnDestroy(): void {
  // ZORUNLU cleanup
  this.scrollService.killAllScrollTriggers();
  if (this.animationFrame) {
    cancelAnimationFrame(this.animationFrame);
  }
}
```

## Debugging

### Progress Indicator
HTML template'te progress bar'ı aktif et:
```html
<div class="hero-progress" 
     *ngIf="true"> <!-- false -> true -->
```

### GSAP Markers
ScrollTrigger debug için:
```typescript
this.scrollService.createScrollScene({
  // ...
  markers: true // Development için
});
```

### Canvas Debug
```typescript
// Console'da progress tracking
console.log('Hero progress:', progress, 'Timeline phase:', this.getCurrentPhase(progress));
```

## Entegrasyon

### 1. Package Installation
```bash
npm install gsap
```

### 2. Component Import
```typescript
import { HeroScrollSceneComponent } from './hero/hero.component';

@Component({
  imports: [HeroScrollSceneComponent]
})
```

### 3. Landing Page'e Ekle
```html
<!-- Landing page -->
<app-hero-scroll-scene 
  [videoSrcMp4]="'assets/hero.mp4'"
  [posterSrc]="'assets/poster.jpg'">
</app-hero-scroll-scene>

<!-- Diğer sections -->
<section class="features">...</section>
```

## Asset Hazırlama

### Video Assets
```bash
src/assets/
├── hero.mp4        # Ana video (H.264)
├── hero.webm       # Fallback video (VP9) 
└── poster.jpg      # Poster/fallback görsel
```

### Örnek FFmpeg Conversion
```bash
# MP4 optimize
ffmpeg -i input.mov -c:v libx264 -preset slow -crf 18 -c:a aac -b:a 128k hero.mp4

# WebM create  
ffmpeg -i input.mov -c:v libvpx-vp9 -crf 20 -b:v 0 -c:a libopus hero.webm

# Poster extract
ffmpeg -i hero.mp4 -ss 4 -vframes 1 -q:v 2 poster.jpg
```

## Troubleshooting

### Build Hatası: GSAP Import
```typescript
// angular.json'da allowedCommonJsDependencies'e ekle
"allowedCommonJsDependencies": [
  "gsap"
]
```

### ScrollTrigger Çalışmıyor
```typescript
// GSAP register kontrolü
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
```

### Canvas Blank
```typescript
// Viewport meta tag kontrolü
<meta name="viewport" content="width=device-width, initial-scale=1">

// Container dimensions
ngAfterViewInit() {
  setTimeout(() => this.resizeCanvas(), 100);
}
```

## Support

Component ile ilgili sorular için:
- **Performance Issues**: Canvas quality settings
- **Video Problems**: Browser compatibility fallbacks  
- **Accessibility**: ARIA ve keyboard navigation
- **Responsive**: Breakpoint optimizasyonları
