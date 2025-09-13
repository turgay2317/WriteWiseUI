import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from './components/shared/toast/toast.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastComponent],
  template: `
    <!-- Router Outlet - Tüm sayfalar burada render olur -->
    <router-outlet></router-outlet>
    
    <!-- Toast Component - Global toast mesajları -->
    <app-toast></app-toast>
  `
})
export class AppComponent {}
