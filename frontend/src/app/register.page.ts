import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { ToastService } from './toast.service';

@Component({
  selector: 'app-register',
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
          style="text-align:center; margin-bottom: 2rem; color: #388e3c; letter-spacing: 1px; font-weight: 700;"
        >
          Register
        </h2>
        <form
          (ngSubmit)="register()"
          #registerForm="ngForm"
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
            style="padding: 0.9rem; border-radius: 8px; background: linear-gradient(90deg, #388e3c 60%, #66bb6a 100%); color: #fff; border: none; font-weight: bold; font-size: 1.1rem; letter-spacing: 0.5px; cursor: pointer; box-shadow: 0 2px 8px rgba(56,142,60,0.08); transition: background 0.2s; width: 100%;"
          >
            Register
          </button>
        </form>
        <button
          routerLink="/login"
          style="margin-top: 1.5rem; padding: 0.8rem 1.5rem; border-radius: 8px; background: #fff; color: #388e3c; border: 2px solid #388e3c; font-weight: bold; font-size: 1rem; cursor: pointer; transition: background 0.2s; width: 100%; max-width: 320px;"
        >
          Already have an account? Login
        </button>
      </div>
    </div>
  `,
})
export class RegisterPage {
  email = '';
  password = '';

  constructor(private http: HttpClient, private toast: ToastService) {}

  register() {
    this.http
      .post<{ message?: string; error?: string }>(
        'http://localhost:3000/register',
        {
          email: this.email,
          password: this.password,
        }
      )
      .subscribe({
        next: (res) => {
          this.toast.show(res.message || 'Registration successful!', 'success');
        },
        error: (err) => {
          this.toast.show(err.error?.error || 'Registration failed.', 'error');
        },
      });
  }
}
