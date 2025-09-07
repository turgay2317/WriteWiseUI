import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../services/core/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed bottom-4 right-4 space-y-2 z-50">
      <div 
        *ngFor="let toast of toastService.toasts()" 
        class="px-4 py-2 rounded-md text-sm text-white shadow-soft-card" 
        [class.bg-success]="toast.type==='success'" 
        [class.bg-error]="toast.type==='error'" 
        [class.bg-info]="toast.type==='info'">
        {{ toast.text }}
      </div>
    </div>
  `
})
export class ToastComponent {
  constructor(public toastService: ToastService) {}
}
