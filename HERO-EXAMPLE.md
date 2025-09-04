# Hero Scroll Scene - Kullanım Örneği

Bu dosya, HeroScrollSceneComponent'ın nasıl kullanılacağını gösterir.

## Hızlı Başlangıç

### 1. Temel Kullanım (Canvas Mode)
```html
<app-hero-scroll-scene></app-hero-scroll-scene>
```

### 2. Video Destekli Kullanım
```html
<app-hero-scroll-scene 
  [videoSrcMp4]="'assets/hero.mp4'"
  [videoSrcWebm]="'assets/hero.webm'"
  [posterSrc]="'assets/poster.jpg'">
</app-hero-scroll-scene>
```

### 3. Özelleştirilmiş Ayarlar
```html
<app-hero-scroll-scene 
  [scrollLengthPx]="3000"
  [durationSec]="10"
  [pin]="true">
</app-hero-scroll-scene>
```

## Component Test Sayfası

Hero component'ını test etmek için mevcut Angular uygulamasında:

1. **Development Server Başlat:**
   ```bash
   npm start
   ```

2. **Tarayıcıda Görüntüle:**
   - URL: `http://localhost:4200`
   - Hero section sayfanın en üstünde görünecek
   - Scroll yaparak animasyonu test edin

3. **Canvas Animasyon Timeline:**
   - **0-20%**: Kağıtlar havada, dolly-in efekti
   - **20-55%**: Soldan sağa tarama geçişi
   - **55-80%**: Kağıtlar düzenli deste haline
   - **80-92%**: Çember çizimi + yeşil check
   - **92-100%**: Sabitlenme

## Browser Test Listesi

✅ **Desteklenen:**
- Chrome 90+ (Full support)
- Firefox 88+ (Full support)  
- Edge 90+ (Full support)
- Safari 14+ (Canvas mode)

⚠️ **Kısıtlı:**
- iOS Safari (Video autoplay kısıtlı, Canvas fallback)

## Debug Modu

Development sırasında progress indicator'ı aktif etmek için:

```typescript
// hero.component.html içinde
<div class="hero-progress" 
     *ngIf="true"> <!-- false -> true yap -->
```

## Accessibility Test

1. **Screen Reader:** VoiceOver/NVDA ile test
2. **Keyboard Navigation:** Tab ile CTA butonlarına erişim
3. **Reduced Motion:** System preferences'te motion'ı kapatıp test
4. **High Contrast:** System high contrast mode ile test

## Performance Monitoring

Browser DevTools'da:
1. **Performance Tab** - 60fps hedef
2. **Memory Tab** - Memory leak kontrolü  
3. **Network Tab** - Asset loading kontrolü

## Özelleştirme Örnekleri

### Renk Paleti Override
```typescript
const customColors = {
  sage: '#a0bfb9',
  coolGray: '#c0cfd0', 
  lightGray: '#f5f5f5',
  white: '#ffffff',
  warmGreen: '#80b48c'
};
```

```html
<app-hero-scroll-scene [colors]="customColors">
</app-hero-scroll-scene>
```

### Scroll Length Ayarlama
```html
<!-- Daha uzun scroll için -->
<app-hero-scroll-scene [scrollLengthPx]="4000">
</app-hero-scroll-scene>

<!-- Daha kısa scroll için -->  
<app-hero-scroll-scene [scrollLengthPx]="1500">
</app-hero-scroll-scene>
```

## Troubleshooting

### Common Issues

**1. GSAP Import Error:**
```bash
npm install gsap
```

**2. ScrollTrigger Not Working:**
```typescript
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
```

**3. Canvas Blank:**
- Browser DevTools Console'ı kontrol et
- `ResizeObserver` desteklenmiyorsa manual resize trigger

**4. Performance Issues:**
- Canvas quality settings düşür
- Device pixel ratio'yu 1'e sabitle

### Log Monitoring

Console'da debug logları:
```
Hero progress: 0.45 Timeline phase: sweep
Canvas render frame: 45/100
Video currentTime: 3.6s
```

## Video Production Notes

### Recommended Video Settings
```bash
# MP4 Export
ffmpeg -i input.mov \
  -c:v libx264 \
  -preset slow \
  -crf 18 \
  -c:a aac \
  -b:a 128k \
  -pix_fmt yuv420p \
  hero.mp4

# WebM Export  
ffmpeg -i input.mov \
  -c:v libvpx-vp9 \
  -crf 20 \
  -b:v 0 \
  -c:a libopus \
  hero.webm
```

### Poster Frame Extract
```bash
ffmpeg -i hero.mp4 -ss 4 -vframes 1 -q:v 2 poster.jpg
```

Bu örnek dosya ile hero component'ını başarıyla test edebilir ve projenizie entegre edebilirsiniz!
