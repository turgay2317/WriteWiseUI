import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-docs',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <main class="layout-container mx-auto max-w-6xl px-4 lg:px-8 py-8">
      <header class="mb-6 text-center">
        <h1 class="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-sage via-warmGreen to-sage bg-clip-text text-transparent">Dokümantasyon</h1>
        <p class="text-sm text-mediumText mt-2">WriteWise platformunu hızlıca entegre edin ve en iyi uygulamaları keşfedin.</p>
      </header>

      <div class="grid gap-6 lg:grid-cols-[260px_1fr] items-start">
        <!-- Sidebar -->
        <aside class="card p-3 border border-borderGray bg-white sticky top-6 h-fit">
          <nav class="text-sm space-y-1">
            <a href="#baslangic" class="block px-3 py-2 rounded-md hover:bg-primary/10">Başlangıç</a>
            <a href="#kurulum" class="block px-3 py-2 rounded-md hover:bg-primary/10">Kurulum</a>
            <a href="#bilesenler" class="block px-3 py-2 rounded-md hover:bg-primary/10">Bileşenler</a>
            <a href="#api" class="block px-3 py-2 rounded-md hover:bg-primary/10">API</a>
            <a href="#sss" class="block px-3 py-2 rounded-md hover:bg-primary/10">SSS</a>
          </nav>
        </aside>

        <!-- Content -->
        <section class="space-y-6">
          <article id="baslangic" class="card p-4 border border-borderGray bg-white">
            <h2 class="text-lg font-semibold text-espresso mb-2">Başlangıç</h2>
            <p class="text-sm text-espresso/80">WriteWise; hızlı kurulum, sade arayüz ve güvenilir analizler sunar. Öğretmen ve öğrenci panelleri ile uçtan uca deneyim sağlar.</p>
          </article>

          <article id="kurulum" class="card p-4 border border-borderGray bg-white">
            <h2 class="text-lg font-semibold text-espresso mb-2">Kurulum</h2>
            <ol class="text-sm text-espresso/80 list-decimal pl-5 space-y-1">
              <li>Hesap oluşturun ve panelinize giriş yapın.</li>
              <li>Sınıf ve öğrenci bilgilerinizi ekleyin.</li>
              <li>Sınavları yükleyin, analizleri başlatın.</li>
            </ol>
          </article>

          <article id="bilesenler" class="card p-4 border border-borderGray bg-white">
            <h2 class="text-lg font-semibold text-espresso mb-2">Bileşenler</h2>
            <ul class="text-sm text-espresso/80 list-disc pl-5 space-y-1">
              <li>Öğrenci Paneli: Sınav listesi ve yapay zeka geri bildirimi.</li>
              <li>Öğretmen Paneli: Sınıf özeti, öğrenciler, yüklenen sınavlar.</li>
              <li>İletişim: Destek ve iş ortaklığı için başvuru.</li>
            </ul>
          </article>

          <article id="api" class="card p-4 border border-borderGray bg-white">
            <h2 class="text-lg font-semibold text-espresso mb-2">API</h2>
            <p class="text-sm text-espresso/80">Uygulama; sınav yükleme, analiz ilerlemesi ve sonuçları okumak için REST uç noktaları sağlar. Kimlik doğrulaması ve oran sınırlaması uygulanır.</p>
          </article>

          <article id="sss" class="card p-4 border border-borderGray bg-white">
            <h2 class="text-lg font-semibold text-espresso mb-2">Sık Sorulan Sorular</h2>
            <div class="text-sm text-espresso/80 space-y-2">
              <div>
                <p class="font-medium text-espresso">Verilerim güvende mi?</p>
                <p>Şifreli aktarım ve erişim kontrolleriyle verilerinizi koruyoruz.</p>
              </div>
              <div>
                <p class="font-medium text-espresso">Öğrenciler nasıl giriş yapar?</p>
                <p>Okul tarafından verilen kimlik bilgileriyle öğrenci panelinden giriş yapılır.</p>
              </div>
            </div>
          </article>
        </section>
      </div>
    </main>
  `,
})
export class DocsComponent {}



