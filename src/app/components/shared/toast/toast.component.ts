import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../services/core/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-4 right-4 space-y-2 z-50">
      <div 
        *ngFor="let toast of toastService.toasts(); trackBy: trackByToastId" 
        class="px-4 py-3 rounded-lg text-sm text-white shadow-lg transform transition-all duration-300 ease-out animate-slide-down"
        [class.bg-green-500]="toast.type==='success'" 
        [class.bg-red-500]="toast.type==='error'" 
        [class.bg-blue-500]="toast.type==='info'"
        [class.bg-yellow-500]="toast.type==='warning'">
        <div class="flex items-center justify-between">
          <span>{{ toast.text }}</span>
          <button 
            (click)="toastService.dismissToast(toast.id)"
            class="ml-3 text-white hover:text-gray-200 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes slideDown {
      from {
        transform: translateY(-100%);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
    
    .animate-slide-down {
      animation: slideDown 0.3s ease-out;
    }
  `]
})
export class ToastComponent {
  constructor(public toastService: ToastService) {}
  
  trackByToastId(index: number, toast: any): number {
    return toast.id;
  }
}
