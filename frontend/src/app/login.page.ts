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
    <div class="login-container">
      <!-- Background with animated elements -->
      <div class="background-animation">
        <div class="floating-shape shape-1"></div>
        <div class="floating-shape shape-2"></div>
        <div class="floating-shape shape-3"></div>
      </div>

      <!-- Main content -->
      <div class="login-content">
        <!-- Left side: Brand and Features -->
        <div class="left-section">
          <!-- Logo/Brand section -->
          <div class="brand-section">
            <div class="logo-container">
              <div class="logo-icon">🌤️</div>
              <h1 class="brand-title">WeatherMap</h1>
              <p class="brand-subtitle">Sistema de Previsão Meteorológica</p>
            </div>
          </div>

          <!-- Features showcase -->
          <div class="features-section">
            <div class="feature-item">
              <div class="feature-icon">🌡️</div>
              <h3>Previsões Precisas</h3>
              <p>Dados meteorológicos em tempo real</p>
            </div>
            <div class="feature-item">
              <div class="feature-icon">📊</div>
              <h3>Análise Avançada</h3>
              <p>Gráficos e estatísticas detalhadas</p>
            </div>
            <div class="feature-item">
              <div class="feature-icon">🔔</div>
              <h3>Alertas Inteligentes</h3>
              <p>Notificações personalizadas</p>
            </div>
          </div>
        </div>

        <!-- Right side: Login form -->
        <div class="login-card">
          <div class="card-header">
            <h2 class="welcome-text">Bem-vindo de volta!</h2>
            <p class="login-description">Faça login para aceder ao seu dashboard</p>
          </div>

          <form (ngSubmit)="login()" #loginForm="ngForm" class="login-form">
            <div class="input-group">
              <label class="input-label">
                <span class="label-icon">📧</span>
                Email
              </label>
              <input
                name="email"
                [(ngModel)]="email"
                required
                type="email"
                placeholder="Introduza o seu email"
                class="form-input"
                [class.input-error]="emailError"
              />
              <div *ngIf="emailError" class="error-message">{{ emailError }}</div>
            </div>

            <div class="input-group">
              <label class="input-label">
                <span class="label-icon">🔒</span>
                Password
              </label>
              <input
                name="password"
                [(ngModel)]="password"
                required
                type="password"
                placeholder="Introduza a sua password"
                class="form-input"
                [class.input-error]="passwordError"
              />
              <div *ngIf="passwordError" class="error-message">{{ passwordError }}</div>
            </div>

            <button type="submit" class="login-button" [disabled]="loading">
              <span *ngIf="!loading">Entrar</span>
              <span *ngIf="loading" class="loading-spinner"></span>
            </button>
          </form>

          <div class="divider">
            <span>ou</span>
          </div>

          <button routerLink="/register" class="register-button">
            Criar nova conta
          </button>

          <div class="demo-info">
            <p class="demo-text">
              <span class="demo-icon">💡</span>
              <strong>Demo:</strong> Use qualquer email e password para testar
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading overlay -->
    <div *ngIf="loading" class="loading-overlay">
      <div class="loading-content">
        <img src="/location.gif" alt="Loading..." class="loading-gif" />
        <div class="loading-text">
          <h3>A conectar...</h3>
          <p>{{ responseTime.toFixed(1) }}s</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #4a90e2 100%);
      position: relative;
      overflow: hidden;
      padding: 2rem;
    }

    .background-animation {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
    }

    .floating-shape {
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.1);
      animation: float 6s ease-in-out infinite;
    }

    .shape-1 {
      width: 100px;
      height: 100px;
      top: 10%;
      left: 10%;
      animation-delay: 0s;
    }

    .shape-2 {
      width: 150px;
      height: 150px;
      top: 60%;
      right: 10%;
      animation-delay: 2s;
    }

    .shape-3 {
      width: 80px;
      height: 80px;
      bottom: 20%;
      left: 20%;
      animation-delay: 4s;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-20px) rotate(180deg); }
    }

    .login-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4rem;
      max-width: 1200px;
      width: 100%;
      z-index: 1;
    }

    .left-section {
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 3rem;
    }

    .brand-section {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .logo-container {
      text-align: center;
      color: white;
    }

    .logo-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
      animation: pulse 2s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.1); }
    }

    .brand-title {
      font-size: 3rem;
      font-weight: 700;
      margin: 0 0 0.5rem 0;
      text-shadow: 0 2px 4px rgba(0,0,0,0.3);
    }

    .brand-subtitle {
      font-size: 1.2rem;
      opacity: 0.9;
      margin: 0;
      font-weight: 300;
    }

    .features-section {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .feature-item {
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(10px);
      padding: 1.5rem;
      border-radius: 16px;
      text-align: center;
      color: white;
      border: 1px solid rgba(255,255,255,0.2);
      transition: all 0.3s ease;
    }

    .feature-item:hover {
      transform: translateY(-5px);
      background: rgba(255, 255, 255, 0.2);
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    }

    .feature-icon {
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }

    .feature-item h3 {
      margin: 0 0 0.5rem 0;
      font-size: 1.1rem;
      font-weight: 600;
    }

    .feature-item p {
      margin: 0;
      opacity: 0.9;
      font-size: 0.9rem;
    }

    .login-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border-radius: 20px;
      padding: 3rem;
      box-shadow: 0 20px 40px rgba(0,0,0,0.1);
      border: 1px solid rgba(255,255,255,0.2);
    }

    .card-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .welcome-text {
      font-size: 2rem;
      font-weight: 700;
      color: #1e3c72;
      margin: 0 0 0.5rem 0;
    }

    .login-description {
      color: #666;
      font-size: 1rem;
      margin: 0;
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .input-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .input-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 600;
      color: #333;
      font-size: 0.9rem;
    }

    .label-icon {
      font-size: 1rem;
    }

    .form-input {
      padding: 1rem;
      border: 2px solid #e1e5e9;
      border-radius: 12px;
      font-size: 1rem;
      transition: all 0.3s ease;
      background: #f8f9fa;
    }

    .form-input:focus {
      outline: none;
      border-color: #1e3c72;
      background: white;
      box-shadow: 0 0 0 3px rgba(30, 60, 114, 0.1);
    }

    .form-input.input-error {
      border-color: #e74c3c;
    }

    .error-message {
      color: #e74c3c;
      font-size: 0.8rem;
      margin-top: 0.25rem;
    }

    .login-button {
      padding: 1rem;
      background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
      color: white;
      border: none;
      border-radius: 12px;
      font-size: 1.1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .login-button:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(30, 60, 114, 0.3);
      background: linear-gradient(135deg, #2a5298 0%, #4a90e2 100%);
    }

    .login-button:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .loading-spinner {
      display: inline-block;
      width: 20px;
      height: 20px;
      border: 2px solid rgba(255,255,255,0.3);
      border-radius: 50%;
      border-top-color: white;
      animation: spin 1s ease-in-out infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .divider {
      text-align: center;
      margin: 2rem 0;
      position: relative;
    }

    .divider::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      height: 1px;
      background: #e1e5e9;
    }

    .divider span {
      background: rgba(255, 255, 255, 0.95);
      padding: 0 1rem;
      color: #666;
      font-size: 0.9rem;
    }

    .register-button {
      width: 100%;
      padding: 1rem;
      background: transparent;
      color: #1e3c72;
      border: 2px solid #1e3c72;
      border-radius: 12px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .register-button:hover {
      background: #1e3c72;
      color: white;
    }

    .demo-info {
      margin-top: 2rem;
      padding: 1rem;
      background: rgba(30, 60, 114, 0.1);
      border-radius: 12px;
      text-align: center;
    }

    .demo-text {
      margin: 0;
      font-size: 0.9rem;
      color: #1e3c72;
    }

    .demo-icon {
      margin-right: 0.5rem;
    }

    .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .loading-content {
      text-align: center;
    }

    .loading-gif {
      width: 80px;
      height: 80px;
      margin-bottom: 1rem;
    }

    .loading-text h3 {
      color: #1e3c72;
      margin: 0 0 0.5rem 0;
      font-size: 1.5rem;
    }

    .loading-text p {
      color: #666;
      margin: 0;
      font-size: 1rem;
    }

    @media (max-width: 768px) {
      .login-content {
        grid-template-columns: 1fr;
        gap: 2rem;
      }

      .left-section {
        order: 2;
      }

      .brand-title {
        font-size: 2rem;
      }

      .login-card {
        padding: 2rem;
      }

      .features-section {
        flex-direction: row;
        gap: 1rem;
        overflow-x: auto;
        padding-bottom: 1rem;
      }

      .feature-item {
        min-width: 200px;
        flex-shrink: 0;
      }
    }
  `]
})
export class LoginPage {
  email = '';
  password = '';
  loading = false;
  responseTime = 0;
  emailError = '';
  passwordError = '';
  private timerInterval: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private toast: ToastService
  ) {}

  login() {
    // Reset errors
    this.emailError = '';
    this.passwordError = '';

    // Basic validation
    if (!this.email) {
      this.emailError = 'Email é obrigatório';
      return;
    }

    if (!this.password) {
      this.passwordError = 'Password é obrigatória';
      return;
    }

    if (!this.email.includes('@')) {
      this.emailError = 'Email inválido';
      return;
    }

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
