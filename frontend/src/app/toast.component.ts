import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from './toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      style="position: fixed; top: 1.5rem; right: 1.5rem; z-index: 2000; display: flex; flex-direction: column; gap: 0.7rem;"
    >
      <div
        *ngFor="let toast of toasts()"
        [ngStyle]="{
          background: toast.type === 'error' ? '#d32f2f' : '#388e3c',
          color: '#fff',
          padding: '1rem 1.5rem',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(60,60,120,0.10)',
          fontWeight: 500,
          minWidth: '220px',
          maxWidth: '320px',
          textAlign: 'center',
          cursor: 'pointer',
          opacity: 0.97
        }"
        (click)="dismiss()"
      >
        {{ toast.message }}
      </div>
    </div>
  `,
})
export class ToastComponent {
  toasts = computed(() => this.toastService.toasts());
  constructor(public toastService: ToastService) {}
  dismiss() {
    this.toastService.dismiss();
  }
}
