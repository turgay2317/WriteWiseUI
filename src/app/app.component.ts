import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <!-- Router Outlet - Tüm sayfalar burada render olur -->
    <router-outlet></router-outlet>
  `
})
export class AppComponent {}
