import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { App } from './app';
import { ToastService } from './toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
  template: `
    <div
      style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #e3f0ff 0%, #fafcff 100%); padding: 2vw;"
    >
      <div
        style="width: 100%; max-width: 400px; padding: 2.5rem 2rem; border-radius: 16px; box-shadow: 0 8px 32px rgba(60,60,120,0.10), 0 1.5px 6px rgba(60,60,120,0.08); background: #fff; margin: auto; display: flex; flex-direction: column; align-items: center;"
      >
        <h2
          style="text-align:center; margin-bottom: 2rem; color: #1976d2; letter-spacing: 1px; font-weight: 700;"
        >
          Login
        </h2>
        <form
          (ngSubmit)="login()"
          #loginForm="ngForm"
          style="display: flex; flex-direction: column; gap: 1.5rem; align-items: center; width: 100%; max-width: 320px;"
        >
          <label
            style="font-weight: 500; color: #333; width: 100%; display: flex; flex-direction: column; align-items: center;"
            >Email
            <input
              name="email"
              [(ngModel)]="email"
              required
              type="email"
              style="width: 100%; margin-top: 0.5rem; padding: 0.75rem; border-radius: 8px; border: 1px solid #cfd8dc; font-size: 1rem; background: #f7fbff; transition: border 0.2s; text-align: center;"
            />
          </label>
          <label
            style="font-weight: 500; color: #333; width: 100%; display: flex; flex-direction: column; align-items: center;"
            >Password
            <input
              name="password"
              [(ngModel)]="password"
              required
              type="password"
              style="width: 100%; margin-top: 0.5rem; padding: 0.75rem; border-radius: 8px; border: 1px solid #cfd8dc; font-size: 1rem; background: #f7fbff; transition: border 0.2s; text-align: center;"
            />
          </label>
          <button
            type="submit"
            style="padding: 0.9rem; border-radius: 8px; background: linear-gradient(90deg, #1976d2 60%, #42a5f5 100%); color: #fff; border: none; font-weight: bold; font-size: 1.1rem; letter-spacing: 0.5px; cursor: pointer; box-shadow: 0 2px 8px rgba(25,118,210,0.08); transition: background 0.2s; width: 100%;"
          >
            Login
          </button>
        </form>
        <button
          routerLink="/register"
          style="margin-top: 1.5rem; padding: 0.8rem 1.5rem; border-radius: 8px; background: #fff; color: #1976d2; border: 2px solid #1976d2; font-weight: bold; font-size: 1rem; cursor: pointer; transition: background 0.2s; width: 100%; max-width: 320px;"
        >
          Nao tem conta? Registe-se
        </button>
      </div>
    </div>
    <div
      *ngIf="loading"
      style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: #fff; z-index: 1000; display: flex; flex-direction: column; align-items: center; justify-content: center;"
    >
      <img
        src="/location.gif"
        alt="Loading..."
        style="width: 96px; height: 96px; display: block; margin: 0 auto;"
      />
      <div
        style="color: #1976d2; margin-top: 1.5rem; font-size: 1.2rem; font-weight: 600;"
      >
        Loading... {{ responseTime.toFixed(2) }}s
      </div>
    </div>
    <div style="margin-top: 2rem; text-align: center;">
      <span style="color: #888; font-size: 0.97rem;"
        >Nao tem conta?</span
      >
      <a
        routerLink="/register"
        style="color: #1976d2; text-decoration: none; font-weight: 600; margin-left: 0.3rem;"
        >Registe-se</a
      >
    </div>
  `,
})
export class LoginPage {
  email = '';
  password = '';
  loading = false;
  responseTime = 0;
  private timerInterval: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private toast: ToastService
  ) {}

  login() {
    this.loading = true;
    this.responseTime = 0;
    if (this.timerInterval) clearInterval(this.timerInterval);
    const start = Date.now();
    this.timerInterval = setInterval(() => {
      this.responseTime = (Date.now() - start) / 1000;
    }, 50);
    this.http
      .post<{ message?: string; error?: string; token?: string }>(
        'http://localhost:3000/login',
        {
          email: this.email,
          password: this.password,
        }
      )
      .subscribe({
        next: (res) => {
          this.toast.show(res.message || 'Login successful!', 'success');
          if (res.token) {
            localStorage.setItem('token', res.token);
            App.isLoggedInSignal?.set(true);
            clearInterval(this.timerInterval);
            this.loading = false;
            this.router.navigateByUrl('/dashboard');
          } else {
            clearInterval(this.timerInterval);
            this.loading = false;
          }
        },
        error: (err) => {
          this.toast.show(err.error?.error || 'Login failed.', 'error');
          clearInterval(this.timerInterval);
          this.loading = false;
        },
      });
  }
}
