import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../../components/shared/footer/footer.component';
import { Router } from '@angular/router';

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: string;
  period: string;
  features: string[];
  buttonText: string;
  buttonStyle: string;
  popular?: boolean;
  enterprise?: boolean;
}

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [CommonModule, FooterComponent],
  template: `
    <!-- Pricing Header -->
    <section class="hero-section bg-gradient-to-br from-sage/10 via-white to-warmGreen/5 py-16 lg:py-24">
      <div class="container mx-auto px-4 lg:px-8 text-center max-w-4xl">
        <h1 class="text-3xl lg:text-5xl font-bold text-espresso mb-6 leading-tight">
          Size Uygun <span class="bg-gradient-to-r from-sage via-warmGreen to-sage bg-clip-text text-transparent">Paketi Seçin</span>
        </h1>
        <p class="text-lg lg:text-xl text-mediumText max-w-2xl mx-auto leading-relaxed">
          Öğrencilerinizin başarısını artırmak için tasarlanmış WriteWise paketlerini keşfedin. Her ihtiyaca özel çözümler.
        </p>
      </div>
    </section>

    <!-- Dark accent divider (hero black vibe) -->
    <div class="dark-accent-divider" aria-hidden="true"></div>

    <!-- Pricing Cards -->
    <section class="pricing-section py-16 lg:py-20">
      <div class="container mx-auto px-4 lg:px-8 max-w-7xl">
        <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-8 lg:gap-6 xl:gap-8">
          
          <!-- Pricing Card Loop -->
          <div *ngFor="let plan of pricingPlans; trackBy: trackPlan" 
               class="pricing-card relative"
               [class.popular-card]="plan.popular"
               [class.enterprise-card]="plan.enterprise">
            
            <!-- Popular Badge -->
            <div *ngIf="plan.popular" class="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
              <span class="bg-warmGreen text-white px-4 py-1 rounded-full text-sm font-semibold">
                ⭐ En Popüler
              </span>
            </div>
            
            <!-- Card Content -->
            <div class="card-content h-full p-8 flex flex-col">
              <!-- Plan Header -->
              <div class="plan-header mb-8">
                <h3 class="text-2xl font-bold text-espresso mb-2">{{ plan.name }}</h3>
                <p class="text-mediumText leading-relaxed">{{ plan.description }}</p>
              </div>
              
              <!-- Pricing -->
              <div class="pricing-info mb-8">
                <div class="price-display flex items-baseline mb-2 py-1">
                  <span class="font-bold text-espresso" [ngClass]="plan.enterprise ? 'text-3xl lg:text-4xl' : 'text-4xl lg:text-5xl'">{{ plan.price }}</span>
                  <span *ngIf="plan.period" class="text-mediumText ml-2 text-lg">/{{ plan.period }}</span>
                </div>
                <div *ngIf="!plan.enterprise" class="text-mediumText text-sm">
                  KDV dahil, istediğiniz zaman iptal edebilirsiniz
                </div>
                <div *ngIf="plan.enterprise" class="text-mediumText text-sm">
                  Özel fiyatlandırma, özelleştirilmiş çözümler
                </div>
              </div>
              
              <!-- Features -->
              <div class="features-list flex-1 mb-8">
                <ul class="space-y-4">
                  <li *ngFor="let feature of plan.features" class="flex items-start">
                    <svg class="w-5 h-5 text-warmGreen mt-0.5 mr-3 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                    </svg>
                    <span class="text-espresso leading-relaxed">{{ feature }}</span>
                  </li>
                </ul>
              </div>
              
              <!-- CTA Button -->
              <button 
                class="cta-button w-full py-3 px-6 rounded-lg font-semibold text-center transition-all duration-200"
                [ngClass]="plan.buttonStyle"
                (click)="selectPlan(plan)">
                {{ plan.buttonText }}
              </button>
            </div>
          </div>
          
        </div>
      </div>
    </section>

    <!-- Dark CTA (hero-style black container) -->
    <section class="cta-dark py-14 lg:py-16">
      <div class="container mx-auto px-4 lg:px-8 max-w-6xl">
        <div class="cta-dark-inner">
          <div class="text-area">
            <h3 class="text-2xl lg:text-3xl font-bold text-white mb-2">WriteWise'i kurumunuzda denemek ister misiniz?</h3>
            <p class="text-white/80 text-sm lg:text-base">Okul veya kurum ihtiyaçlarınıza uygun özelleştirilmiş çözümler için ekibimizle hemen iletişime geçin.</p>
          </div>
          <div class="actions">
            <button class="cta-primary" (click)="selectPlan(pricingPlans[0])">Ücretsiz Başla</button>
            <button class="cta-secondary" (click)="goToContact()">Bize Ulaşın</button>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="faq-section bg-gradient-to-br from-sage/5 to-coolGray/5 py-16 lg:py-20">
      <div class="container mx-auto px-4 lg:px-8 max-w-4xl text-center">
        <h2 class="text-2xl lg:text-3xl font-bold text-espresso mb-4">
          Sıkça Sorulan Sorular
        </h2>
        <p class="text-mediumText mb-12 leading-relaxed">
          WriteWise hakkında merak ettiklerinizi yanıtladık. Daha fazla bilgi için bizimle iletişime geçin.
        </p>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 text-left">
          <div class="faq-item">
            <h4 class="text-lg font-semibold text-espresso mb-2">Deneme süresi var mı?</h4>
            <p class="text-mediumText leading-relaxed">Evet! Free paketimizle 30 gün boyunca tüm temel özellikleri ücretsiz deneyebilirsiniz.</p>
          </div>
          
          <div class="faq-item">
            <h4 class="text-lg font-semibold text-espresso mb-2">Öğrenci sayısı sınırı var mı?</h4>
            <p class="text-mediumText leading-relaxed">Bireysel pakette 100 öğrenci, Okul paketinde 500 öğrenci sınırı vardır. Enterprise'da sınır yoktur.</p>
          </div>
          
          <div class="faq-item">
            <h4 class="text-lg font-semibold text-espresso mb-2">Veri güvenliği nasıl sağlanıyor?</h4>
            <p class="text-mediumText leading-relaxed">Tüm verileriniz SSL ile şifrelenir ve KVKK uyumlu sunucularda saklanır. Düzenli yedekleme yapılır.</p>
          </div>
          
          <div class="faq-item">
            <h4 class="text-lg font-semibold text-espresso mb-2">Destek hizmeti var mı?</h4>
            <p class="text-mediumText leading-relaxed">Evet! Tüm paketlerde email desteği, Okul ve Enterprise paketlerinde öncelikli destek sunuyoruz.</p>
          </div>
        </div>
        
        <div class="mt-12">
          <button class="btn-secondary" (click)="goToContact()">
            Daha Fazla Soru? Bizimle İletişime Geçin
          </button>
        </div>
      </div>
    </section>

    <app-footer></app-footer>
  `,
  styleUrls: ['./pricing.component.scss']
})
export class PricingComponent {
  pricingPlans: PricingPlan[] = [
    {
      id: 'free',
      name: 'Free',
      description: 'Bireysel öğretmenler için deneme sürümü',
      price: '₺0',
      period: '',
      features: [
        '5 öğrenciye kadar',
        '10 sınav analizi',
        'Temel raporlar',
        'Email desteği',
        '30 gün deneme süresi'
      ],
      buttonText: 'Ücretsiz Başla',
      buttonStyle: 'btn-hero-dark'
    },
    {
      id: 'individual',
      name: 'Bireysel',
      description: 'Öğretmenler ve küçük sınıflar için',
      price: '₺299',
      period: 'ay',
      features: [
        '100 öğrenciye kadar',
        'Sınırsız sınav analizi',
        'Detaylı raporlar',
        'Kopya tespit sistemi',
        'Email desteği',
        'Veri dışa aktarma'
      ],
      buttonText: 'Bireysel Paketi Seç',
      buttonStyle: 'btn-hero-dark',
      popular: true
    },
    {
      id: 'school',
      name: 'Okul Paketi',
      description: 'Okullar ve kurumsal eğitim merkezleri için',
      price: '₺1.299',
      period: 'ay',
      features: [
        '500 öğrenciye kadar',
        'Çoklu öğretmen desteği',
        'Gelişmiş analytics',
        'API entegrasyonları',
        'Öncelikli destek',
        'Özelleştirilmiş raporlar',
        'Admin panel',
        'Bulk import/export'
      ],
      buttonText: 'Okul Paketini Seç',
      buttonStyle: 'btn-hero-dark'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'Büyük kurumlar, milli eğitim ve dershaneler için',
      price: 'Özel Fiyat',
      period: '',
      features: [
        'Sınırsız öğrenci',
        'Sınırsız öğretmen',
        'White-label çözümler',
        'Özel veritabanı',
        '7/24 destek',
        'Özel geliştirmeler',
        'SLA garantisi',
        'Eğitim ve implementasyon'
      ],
      buttonText: 'İletişime Geç',
      buttonStyle: 'btn-hero-dark',
      enterprise: true
    }
  ];

  constructor(private router: Router) {}

  trackPlan(index: number, plan: PricingPlan): string {
    return plan.id;
  }

  selectPlan(plan: PricingPlan): void {
    if (plan.id === 'free') {
      // Free plan için direkt dashboard'a git
      this.router.navigate(['/dashboard']);
    } else if (plan.id === 'enterprise') {
      // Enterprise için iletişim
      this.goToContact();
    } else {
      // Diğer paketler için ödeme sayfası (şimdilik dashboard)
      console.log(`${plan.name} paketi seçildi`);
      this.router.navigate(['/dashboard']);
    }
  }

  goToContact(): void {
    // İletişim sayfasına yönlendir (şimdilik console log)
    console.log('İletişim sayfasına yönlendiriliyor...');
  }
}
