import { Injectable, signal } from '@angular/core';
import { Toast, ToastType } from '../../models';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastsSignal = signal<Toast[]>([]);
  private toastId = 0;

  get toasts() {
    return this.toastsSignal;
  }

  pushToast(type: ToastType, text: string) {
    const id = ++this.toastId;
    this.toastsSignal.update(toasts => [...toasts, { id, type, text }]);
    setTimeout(() => this.dismissToast(id), 3000);
  }

  dismissToast(id: number) {
    this.toastsSignal.update(toasts => toasts.filter(toast => toast.id !== id));
  }

  // Generic toast methods
  showSuccess(message: string) {
    this.pushToast('success', message);
  }

  showError(message: string) {
    this.pushToast('error', message);
  }

  showInfo(message: string) {
    this.pushToast('info', message);
  }

  showWarning(message: string) {
    this.pushToast('warning', message);
  }

  // Specific toast actions
  startAnalysisSuccess() {
    this.pushToast('success', 'Sınav başarıyla yüklendi.');
  }

  startAnalysisError() {
    this.pushToast('error', 'Yükleme başarısız.');
  }

  logout() {
    this.pushToast('info', 'Çıkış yapıldı');
  }
}
