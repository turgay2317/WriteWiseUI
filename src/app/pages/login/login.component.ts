import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="register-hero">
      <div class="register-wrapper">
        <img class="logo" src="assets/graduation-cap.svg" alt="Write Wise" />
        <h1 class="heading">{{ heading }}</h1>

        <div class="register-card login-card">
          <form (submit)="onSubmit($event)" class="form-grid login-grid">
            <div class="form-field col-span-2">
              <label for="email">E‑posta</label>
              <input id="email" type="email" required [(ngModel)]="email" name="email" placeholder="E‑posta adresiniz" />
            </div>

            <div class="form-field col-span-2">
              <div class="label-row">
                <label for="password">Şifre</label>
                <button type="button" class="link subtle small" (click)="onForgotPassword()">Şifreni mi unuttun?</button>
              </div>
              <div class="input-with-icon">
                <input id="password" [type]="showPassword ? 'text' : 'password'" required [(ngModel)]="password" name="password" placeholder="Şifreniz" />
                <button type="button" class="icon-btn" (click)="toggleShowPassword()" aria-label="Şifreyi göster/gizle">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path *ngIf="!showPassword" d="M12 5c-7 0-10 7-10 7s3 7 10 7 10-7 10-7-3-7-10-7Zm0 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z" stroke="currentColor" stroke-width="1.5"/>
                    <path *ngIf="showPassword" d="M3 3l18 18M9.9 9.9A4 4 0 0 1 14.1 14.1M2 12s3-7 10-7c2.1 0 3.9.6 5.4 1.5M22 12s-3 7-10 7c-2.1 0-3.9-.6-5.4-1.5" stroke="currentColor" stroke-width="1.5"/>
                  </svg>
                </button>
              </div>
            </div>

            <div class="col-span-2 login-actions">
              <button type="submit" class="btn-continue primary">Giriş yap</button>
            </div>

            <div class="col-span-2 divider"><span>VEYA</span></div>

            <div class="col-span-2">
              <button type="button" class="btn-alt" (click)="onEmailCode()">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 6h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z" stroke="currentColor" stroke-width="1.5"/>
                  <path d="M22 8l-9.2 5.75a2 2 0 0 1-1.6 0L2 8" stroke="currentColor" stroke-width="1.5"/>
                </svg>
                <span>E‑posta ile giriş kodu</span>
              </button>
            </div>
          </form>
        </div>

        <p class="signin-note">
          Hesabın yok mu?
          <button type="button" class="link" (click)="goRegister()">Kayıt ol</button>
        </p>
      </div>
    </section>
  `,
  styleUrls: ['../register/register.component.scss', './login.component.scss']
})
export class LoginComponent {
  email = '';
  password = '';
  showPassword = false;
  heading = 'Öğretmen Girişi';
  private isStudent = false;

  constructor(private router: Router, private route: ActivatedRoute) {
    this.route.queryParamMap.subscribe(params => {
      const role = params.get('role');
      if (role === 'student') {
        this.heading = 'Öğrenci Girişi';
        this.isStudent = true;
      } else {
        this.heading = 'Öğretmen Girişi';
        this.isStudent = false;
      }
    });
  }

  onSubmit(ev: Event) {
    ev.preventDefault();
    // Demo giriş
    alert('Giriş başarılı! (demo)');
    this.router.navigate([this.isStudent ? '/ogrenci' : '/dashboard']);
  }

  goRegister() {
    this.router.navigate(['/register']);
  }

  onForgotPassword() {
    alert('Şifre sıfırlama bağlantısı (demo)');
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  onEmailCode() {
    alert('E‑posta ile giriş kodu gönderildi (demo)');
  }
}


