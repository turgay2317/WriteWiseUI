import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthApiService, TeacherLoginRequest, StudentLoginRequest } from '../../services/api/auth-api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="register-hero">
      <div class="register-wrapper">
        <img class="logo" src="assets/graduation-cap.svg" alt="Teknofest25" />
        <h1 class="heading">{{ heading }}</h1>

        <div class="register-card login-card">
          <form (submit)="onSubmit($event)" class="form-grid login-grid">
            <!-- Teacher Login Fields -->
            <ng-container *ngIf="!isStudent">
              <div class="form-field col-span-2">
                <label for="username">Kullanıcı Adı</label>
                <input id="username" type="text" required [(ngModel)]="username" name="username" placeholder="Kullanıcı adınız" />
              </div>

              <div class="form-field col-span-2">
                <div class="label-row">
                  <label for="password">Şifre</label>
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
            </ng-container>

            <!-- Student Login Fields -->
            <ng-container *ngIf="isStudent">
              <div class="form-field col-span-2">
                <label for="numara">Öğrenci Numarası</label>
                <input id="numara" type="text" required [(ngModel)]="numara" name="numara" placeholder="Öğrenci numaranız" />
              </div>

              <div class="form-field col-span-2">
                <label for="ad">Ad</label>
                <input id="ad" type="text" required [(ngModel)]="ad" name="ad" placeholder="Adınız" />
              </div>

              <div class="form-field col-span-2">
                <label for="soyad">Soyad</label>
                <input id="soyad" type="text" required [(ngModel)]="soyad" name="soyad" placeholder="Soyadınız" />
              </div>
            </ng-container>

            <div class="col-span-2 login-actions">
              <button type="submit" class="btn-continue primary" [disabled]="isLoading">
                <span *ngIf="!isLoading">Giriş yap</span>
                <span *ngIf="isLoading">Giriş yapılıyor...</span>
              </button>
            </div>

            <div class="col-span-2 divider"><span>VEYA</span></div>

            <div class="col-span-2">
              <button type="button" class="btn-alt" (click)="toggleUserType()">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" stroke="currentColor" stroke-width="1.5"/>
                </svg>
                <span>{{ isStudent ? 'Öğretmen olarak giriş yap' : 'Öğrenci olarak giriş yap' }}</span>
              </button>
            </div>
          </form>
        </div>

        <div *ngIf="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
      </div>
    </section>
  `,
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  // Teacher fields
  username = '';
  password = '';
  
  // Student fields
  numara = '';
  ad = '';
  soyad = '';
  
  // UI state
  showPassword = false;
  heading = 'Öğretmen Girişi';
  isStudent = false;
  isLoading = false;
  errorMessage = '';

  constructor(
    private router: Router, 
    private route: ActivatedRoute,
    private authService: AuthApiService
  ) {
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
    this.errorMessage = '';
    this.isLoading = true;

    if (this.isStudent) {
      this.studentLogin();
    } else {
      this.teacherLogin();
    }
  }

  private teacherLogin() {
    const credentials: TeacherLoginRequest = {
      username: this.username,
      password: this.password
    };

    this.authService.teacherLogin(credentials).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.error || 'Giriş yapılırken bir hata oluştu';
      }
    });
  }

  private studentLogin() {
    const credentials: StudentLoginRequest = {
      numara: this.numara,
      ad: this.ad,
      soyad: this.soyad
    };

    this.authService.studentLogin(credentials).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.router.navigate(['/ogrenci']);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.error || 'Giriş yapılırken bir hata oluştu';
      }
    });
  }

  toggleUserType() {
    this.isStudent = !this.isStudent;
    this.heading = this.isStudent ? 'Öğrenci Girişi' : 'Öğretmen Girişi';
    this.errorMessage = '';
    this.clearForm();
  }

  private clearForm() {
    this.username = '';
    this.password = '';
    this.numara = '';
    this.ad = '';
    this.soyad = '';
    this.showPassword = false;
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }
}


