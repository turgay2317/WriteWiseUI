# Angular Routing Sistemi - Kullanım Kılavuzu

Bu proje artık **iki ayrı sayfa** olarak çalışmaktadır:

## 📄 **Sayfa Yapısı**

### 1. **Landing Page** (`/`)
- **URL**: `http://localhost:4200/`
- **Component**: `LandingComponent`
- **İçerik**: Hero scroll animation + Features + CTA
- **Amaç**: Ziyaretçileri karşılamak ve dashboard'a yönlendirmek

### 2. **Dashboard** (`/dashboard`)
- **URL**: `http://localhost:4200/dashboard`  
- **Component**: `DashboardComponent`
- **İçerik**: Öğretmen paneli (öğrenciler, sınavlar, vb.)
- **Amaç**: Öğretmen admin panel fonksiyonları

## 🔄 **Navigation Akışı**

```
Ziyaretçi
    ↓
Landing Page (/)
    ↓ (CTA butonları)
Dashboard (/dashboard)
    ↓ (Çıkış butonu)
Landing Page (/)
```

## 🎯 **Kullanıcı Deneyimi**

1. **İlk Ziyaret**: Landing page'de hero animasyonu
2. **CTA Tıklama**: "Ücretsiz Deneyin" → Dashboard'a git
3. **Çalışma**: Dashboard'da öğretmen panel işlemleri
4. **Çıkış**: Header'daki "Çıkış" → Landing'e dön

## 🔧 **Teknik Detaylar**

### Routing Configuration
```typescript
// app.routes.ts
const routes: Routes = [
  { path: '', component: LandingComponent },       // Ana sayfa
  { path: 'dashboard', component: DashboardComponent }, // Panel
  { path: '**', redirectTo: '' }                  // 404 → Ana sayfa
];
```

### Component Event Flow
```typescript
// Landing page'de CTA click
onGetStarted() {
  this.router.navigate(['/dashboard']);
}

// Dashboard'da logout
onLogout() {
  this.router.navigate(['/']);
}
```

## 📱 **Responsive Behavior**

### Landing Page
- **Desktop**: Hero fullscreen + features grid
- **Mobile**: Hero 70vh + stacked features
- **Animation**: Scroll-scrubbing her cihazda çalışır

### Dashboard  
- **Desktop**: 2×2 grid layout
- **Mobile**: Single column stack
- **Modules**: Expand to fullscreen on click

## 🎨 **Stil Tutarlılığı**

Her iki sayfa da aynı renk paletini kullanır:
```scss
$sage: #a0bfb9;
$cool-gray: #c0cfd0;
$light-gray: #f5f5f5;
$white: #ffffff;
$warm-green: #80b48c;
```

## 🚀 **Development Commands**

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

## 📊 **URL Test List**

| URL | Expected Page | Components Loaded |
|-----|---------------|-------------------|
| `/` | Landing | Hero + Features + CTA |
| `/dashboard` | Dashboard | Header + Grid + Modules |
| `/invalid-route` | Landing | Redirect to `/` |

## 🔍 **Debugging Routes**

Angular DevTools'da route navigation'ı görmek için:
```typescript
// app.config.ts'de
import { provideRouter, withDebugTracing } from '@angular/router';

providers: [
  provideRouter(routes, withDebugTracing()) // Route logs
]
```

## ⚡ **Performance Notes**

- **Lazy Loading**: Şu anda gerek yok (2 sayfa sadece)
- **Bundle Size**: 476KB initial (gzipped: 133KB)
- **Hero Animation**: GSAP-optimized smooth scrolling
- **Memory**: Component cleanup automatic

## 🎯 **Next Steps**

1. **Landing SEO**: Meta tags, structured data
2. **Dashboard Auth**: Login guard ekle
3. **Deep Links**: Dashboard sub-routes
4. **Analytics**: Route tracking

Bu yapı ile landing page ve dashboard ayrı sayfalar olarak mükemmel çalışıyor! 🚀
