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
