import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ToastService {
  public toasts = signal<{ message: string; type: 'success' | 'error' }[]>([]);

  show(message: string, type: 'success' | 'error' = 'success') {
    this.toasts.update((toasts) => [...toasts, { message, type }]);
    setTimeout(() => this.dismiss(), 3000);
  }

  dismiss() {
    this.toasts.update((toasts) => toasts.slice(1));
  }
}
