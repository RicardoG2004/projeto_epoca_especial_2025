import { Component, signal } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastComponent } from './toast.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, ToastComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('frontend');
  public static isLoggedInSignal: ReturnType<typeof signal>;
  public readonly isLoggedInSignal = signal(!!localStorage.getItem('token'));

  constructor(private router: Router) {
    App.isLoggedInSignal = this.isLoggedInSignal;
    window.addEventListener('storage', () => {
      this.isLoggedInSignal.set(!!localStorage.getItem('token'));
    });
  }

  logout() {
    localStorage.removeItem('token');
    this.isLoggedInSignal.set(false);
    this.router.navigateByUrl('/login');
  }
}
