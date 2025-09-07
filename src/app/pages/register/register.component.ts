import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="register-hero">
      <div class="register-wrapper">
        <img class="logo" src="assets/graduation-cap.svg" alt="Write Wise" />
        <h1 class="heading">Kayıt Ol</h1>

        <div class="register-card">
          <form (submit)="onSubmit($event)" class="form-grid">
            <div class="form-field">
              <label for="firstName">Ad</label>
              <input id="firstName" type="text" required [(ngModel)]="firstName" name="firstName" placeholder="Adınız" />
            </div>

            <div class="form-field">
              <label for="lastName">Soyad</label>
              <input id="lastName" type="text" required [(ngModel)]="lastName" name="lastName" placeholder="Soyadınız" />
            </div>

            <div class="form-field col-span-2">
              <label for="email">E‑posta</label>
              <input id="email" type="email" required [(ngModel)]="email" name="email" placeholder="E‑posta adresiniz" />
            </div>

            <div class="form-field col-span-2">
              <label>Rol</label>
              <div class="role-toggle" role="tablist" aria-label="Rol seçimi">
                <button type="button"
                        class="role-btn"
                        [class.active]="role==='student'"
                        [attr.aria-pressed]="role==='student'"
                        (click)="setRole('student')">Öğrenci</button>
                <button type="button"
                        class="role-btn"
                        [class.active]="role==='teacher'"
                        [attr.aria-pressed]="role==='teacher'"
                        (click)="setRole('teacher')">Öğretmen</button>
              </div>
            </div>

            <ng-container *ngIf="role === 'student'">
              <div class="form-field">
                <label for="schoolNumber">Okul Numarası</label>
                <input id="schoolNumber" type="text" required [(ngModel)]="schoolNumber" name="schoolNumber" placeholder="Okul numaranız" />
              </div>

              <div class="form-field">
                <label for="className">Sınıf</label>
                <input id="className" type="text" required [(ngModel)]="className" name="className" placeholder="Sınıfınız (örn. 10-B)" />
              </div>
            </ng-container>

            <ng-container *ngIf="role === 'teacher'">
              <div class="form-field col-span-2">
                <label for="institutionCode">Kurum Kodu</label>
                <input id="institutionCode" type="text" required [(ngModel)]="institutionCode" name="institutionCode" placeholder="Kurum kodunuz" />
              </div>
            </ng-container>

            <div class="col-span-2">
              <button type="submit" class="btn-continue primary">Devam et</button>
            </div>
          </form>
        </div>

        <p class="signin-note">
          Zaten bir hesabınız var mı?
          <button type="button" class="link" (click)="goLogin()">Giriş yapın</button>
        </p>

        <p class="tos">
          Hesap oluşturarak, <a href="#">Hizmet Şartları</a> ve <a href="#">Gizlilik Politikası</a>'nı kabul etmiş olursunuz.
        </p>
      </div>
    </section>
  `,
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  firstName = '';
  lastName = '';
  email = '';
  role: 'student' | 'teacher' = 'student';
  schoolNumber = '';
  className = '';
  institutionCode = '';

  constructor(private router: Router) {}

  onSubmit(ev: Event) {
    ev.preventDefault();
    // Şimdilik demo: başarılı kayıt varsayımı
    alert('Kayıt alındı! (demo)');
    this.router.navigate(['/dashboard']);
  }

  goLogin() {
    this.router.navigate(['/login']);
  }

  setRole(next: 'student' | 'teacher') {
    this.role = next;
    if (next === 'student') {
      this.institutionCode = '';
    } else {
      this.schoolNumber = '';
      this.className = '';
    }
  }

}


