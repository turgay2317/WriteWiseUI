import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <main class="layout-container mx-auto max-w-5xl px-4 lg:px-8 py-8">
      <section class="text-center mb-8">
        <h1 class="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-sage via-warmGreen to-sage bg-clip-text text-transparent">İletişim</h1>
        <p class="text-sm text-mediumText mt-2">Sorularınız, işbirliği teklifleri ve destek talepleri için bize ulaşın.</p>
      </section>

      <div class="grid gap-4 lg:grid-cols-3">
        <!-- Info Cards -->
        <div class="card p-4 border border-borderGray bg-white">
          <div class="flex items-center gap-3 mb-2">
            <div class="h-10 w-10 rounded-xl bg-primary grid place-items-center text-white">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M22 12l-4-4v3H3v2h15v3z"/>
              </svg>
            </div>
            <h3 class="text-base font-semibold text-espresso">Adres</h3>
          </div>
          <p class="text-sm text-espresso/80">WriteWise Teknoloji A.Ş.<br/>Mustafa Kemal Mah. 1234. Cad. No: 7/12<br/>Çankaya, Ankara 06510</p>
        </div>

        <div class="card p-4 border border-borderGray bg-white">
          <div class="flex items-center gap-3 mb-2">
            <div class="h-10 w-10 rounded-xl bg-primary grid place-items-center text-white">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07A19.5 19.5 0 0 1 3.15 9.81 19.8 19.8 0 0 1 .08 1.18 2 2 0 0 1 2.05-.99h3a2 2 0 0 1 2 1.72c.12.9.32 1.78.6 2.62a2 2 0 0 1-.45 2.11L6 6.5a16 16 0 0 0 7.5 7.5l1.03-1.2a2 2 0 0 1 2.11-.45c.84.28 1.72.48 2.62.6a2 2 0 0 1 1.72 2v1.97z"/>
              </svg>
            </div>
            <h3 class="text-base font-semibold text-espresso">Telefon</h3>
          </div>
          <p class="text-sm text-espresso/80">+90 (312) 555 00 00<br/>+90 (850) 123 45 67</p>
        </div>

        <div class="card p-4 border border-borderGray bg-white">
          <div class="flex items-center gap-3 mb-2">
            <div class="h-10 w-10 rounded-xl bg-primary grid place-items-center text-white">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M4 4h16v16H4z"/>
                <path d="M22 6l-10 7L2 6"/>
              </svg>
            </div>
            <h3 class="text-base font-semibold text-espresso">E‑posta</h3>
          </div>
          <p class="text-sm text-espresso/80">destek@writewise.com<br/>info@writewise.com</p>
        </div>
      </div>

      <!-- Contact Form -->
      <div class="card p-4 mt-4 border border-borderGray bg-white">
        <h3 class="text-base font-semibold text-espresso mb-2">Bize Yazın</h3>
        <form class="grid gap-3 lg:grid-cols-2">
          <div>
            <label class="text-xs font-semibold text-espresso">Ad Soyad</label>
            <input class="mt-1 w-full rounded-md border border-borderGray px-3 py-2 text-sm" placeholder="Adınızı ve soyadınızı yazın"/>
          </div>
          <div>
            <label class="text-xs font-semibold text-espresso">E‑posta</label>
            <input type="email" class="mt-1 w-full rounded-md border border-borderGray px-3 py-2 text-sm" placeholder="ornek@mail.com"/>
          </div>
          <div class="lg:col-span-2">
            <label class="text-xs font-semibold text-espresso">Konu</label>
            <input class="mt-1 w-full rounded-md border border-borderGray px-3 py-2 text-sm" placeholder="Konu başlığı"/>
          </div>
          <div class="lg:col-span-2">
            <label class="text-xs font-semibold text-espresso">Mesajınız</label>
            <textarea rows="5" class="mt-1 w-full rounded-md border border-borderGray px-3 py-2 text-sm" placeholder="Mesajınızı buraya yazın"></textarea>
          </div>
          <div class="lg:col-span-2">
            <button type="button" class="btn btn-secondary">Gönder</button>
          </div>
        </form>
      </div>
    </main>
  `,
})
export class ContactComponent {}



