import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

interface ForecastData {
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    weather_code: number[];
    precipitation_probability_max: number[];
  };
  daily_units: {
    temperature_2m_max: string;
    temperature_2m_min: string;
    precipitation_probability_max: string;
  };
}

@Component({
  selector: 'app-forecast',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  template: `
    <div class="forecast-container">
      <!-- Background with animated elements -->
      <div class="background-animation">
        <div class="floating-shape shape-1"></div>
        <div class="floating-shape shape-2"></div>
        <div class="floating-shape shape-3"></div>
      </div>

      <!-- Main content -->
      <div class="forecast-content">
        <!-- Forecast content -->
        <div class="forecast-card">
          <div class="card-header">
            <div class="header-content">
              <h2 class="forecast-title">📅 Previsão Meteorológica</h2>
              <button (click)="goBack()" class="back-button">
                ← Voltar
              </button>
            </div>
          </div>

          <div *ngIf="cityName" class="city-info">
            <h3 class="city-name">{{ cityName }}</h3>
            <p class="forecast-description">Previsão para os próximos 7 dias</p>
          </div>

          <div *ngIf="loading" class="loading-section">
            <div class="loading-icon">⏳</div>
            <p class="loading-text">A carregar previsão meteorológica...</p>
          </div>

          <div *ngIf="error" class="error-section">
            <div class="error-icon">⚠️</div>
            <p class="error-text">{{ error }}</p>
          </div>

          <!-- Forecast Grid -->
          <div *ngIf="forecastData && !loading" class="forecast-grid">
            <div *ngFor="let day of forecastData.daily.time; let i = index" class="forecast-day">
              
              <!-- Day Header -->
              <div class="day-header">
                <div class="day-name">{{ formatDate(day) }}</div>
                <div class="day-date">{{ formatFullDate(day) }}</div>
              </div>

              <!-- Weather Icon and Temperature -->
              <div class="weather-section">
                <div class="weather-icon-large">
                  {{ getWeatherIcon(forecastData.daily.weather_code[i]) }}
                </div>
                <div class="temperature-range">
                  <div class="temp-item">
                    <div class="temp-value max">{{ Math.round(forecastData.daily.temperature_2m_max[i]) }}°</div>
                    <div class="temp-label">Máxima</div>
                  </div>
                  <div class="temp-divider"></div>
                  <div class="temp-item">
                    <div class="temp-value min">{{ Math.round(forecastData.daily.temperature_2m_min[i]) }}°</div>
                    <div class="temp-label">Mínima</div>
                  </div>
                </div>
              </div>

              <!-- Weather Description -->
              <div class="weather-description">
                {{ getWeatherDescription(forecastData.daily.weather_code[i]) }}
              </div>

              <!-- Precipitation Probability -->
              <div *ngIf="forecastData.daily.precipitation_probability_max[i] > 0" class="precipitation-info rain">
                💧 {{ forecastData.daily.precipitation_probability_max[i] }}% de probabilidade de chuva
              </div>

              <!-- No Rain Message -->
              <div *ngIf="forecastData.daily.precipitation_probability_max[i] === 0" class="precipitation-info no-rain">
                ☀️ Sem precipitação prevista
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .forecast-container {
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

    .forecast-content {
      display: flex;
      justify-content: center;
      max-width: 1200px;
      width: 100%;
      z-index: 1;
    }

    .forecast-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border-radius: 20px;
      padding: 3rem;
      box-shadow: 0 20px 40px rgba(0,0,0,0.1);
      border: 1px solid rgba(255,255,255,0.2);
      max-height: 90vh;
      overflow-y: auto;
      width: 100%;
    }

    .card-header {
      margin-bottom: 2rem;
    }

    .header-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
    }

    .forecast-title {
      color: #1e3c72;
      font-weight: 700;
      margin: 0;
      font-size: 2rem;
    }

    .back-button {
      padding: 0.7rem 1.5rem;
      border-radius: 8px;
      background: #fff;
      color: #1e3c72;
      border: 2px solid #1e3c72;
      font-weight: bold;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .back-button:hover {
      background: #1e3c72;
      color: white;
    }

    .city-info {
      text-align: center;
      margin-bottom: 2rem;
    }

    .city-name {
      color: #333;
      font-size: 1.5rem;
      margin-bottom: 0.5rem;
      font-weight: 600;
    }

    .forecast-description {
      color: #666;
      font-size: 1.1rem;
      margin: 0;
    }

    .loading-section, .error-section {
      text-align: center;
      padding: 2rem;
    }

    .loading-icon, .error-icon {
      font-size: 2rem;
      margin-bottom: 1rem;
    }

    .loading-text {
      color: #666;
      margin: 0;
    }

    .error-text {
      color: #d32f2f;
      margin: 0;
    }

    .forecast-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
    }

    .forecast-day {
      background: linear-gradient(135deg, #f8f9ff 0%, #e8f4fd 100%);
      border-radius: 16px;
      padding: 2rem;
      border: 1px solid #e3f2fd;
      box-shadow: 0 8px 24px rgba(25,118,210,0.1);
      transition: transform 0.3s ease;
    }

    .forecast-day:hover {
      transform: translateY(-5px);
    }

    .day-header {
      text-align: center;
      margin-bottom: 1.5rem;
    }

    .day-name {
      font-size: 1.3rem;
      font-weight: 600;
      color: #1e3c72;
      margin-bottom: 0.5rem;
    }

    .day-date {
      font-size: 0.9rem;
      color: #666;
    }

    .weather-section {
      text-align: center;
      margin-bottom: 1.5rem;
    }

    .weather-icon-large {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .temperature-range {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1rem;
    }

    .temp-item {
      text-align: center;
    }

    .temp-value {
      font-size: 1.8rem;
      font-weight: bold;
    }

    .temp-value.max {
      color: #1e3c72;
    }

    .temp-value.min {
      color: #666;
    }

    .temp-label {
      font-size: 0.8rem;
      color: #666;
    }

    .temp-divider {
      width: 1px;
      height: 40px;
      background: #e0e0e0;
    }

    .weather-description {
      text-align: center;
      margin-bottom: 1rem;
      font-size: 1rem;
      color: #333;
      text-transform: capitalize;
    }

    .precipitation-info {
      text-align: center;
      padding: 0.8rem;
      border-radius: 8px;
      font-size: 0.9rem;
      font-weight: 600;
    }

    .precipitation-info.rain {
      background: rgba(25,118,210,0.1);
      color: #1976d2;
    }

    .precipitation-info.no-rain {
      background: rgba(76,175,80,0.1);
      color: #4caf50;
    }

    @media (max-width: 768px) {
      .forecast-card {
        padding: 2rem;
      }

      .header-content {
        flex-direction: column;
        gap: 1rem;
        align-items: flex-start;
      }

      .forecast-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
      }
    }
  `]
})
export class ForecastPage {
  forecastData: ForecastData | null = null;
  cityName: string = '';
  loading = true;
  error = '';
  Math = Math;

  constructor(
    private http: HttpClient, 
    private router: Router, 
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Obter parâmetros da URL
    this.route.queryParams.subscribe(params => {
      const lat = params['lat'];
      const lon = params['lon'];
      const city = params['city'];
      
      if (lat && lon && city) {
        this.cityName = city;
        this.getForecastData(parseFloat(lat), parseFloat(lon));
      } else {
        this.error = 'Parâmetros inválidos para a previsão.';
        this.loading = false;
      }
    });
  }

  getForecastData(lat: number, lon: number) {
    this.loading = true;
    this.error = '';

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,weather_code,precipitation_probability_max&timezone=auto`;
    
    this.http.get<ForecastData>(url).subscribe({
      next: (data) => {
        this.forecastData = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erro ao buscar dados de previsão:', err);
        this.error = 'Erro ao carregar a previsão meteorológica.';
        this.loading = false;
      }
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long'
    };
    return date.toLocaleDateString('pt-BR', options);
  }

  formatFullDate(dateString: string): string {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { 
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    };
    return date.toLocaleDateString('pt-BR', options);
  }

  getWeatherIcon(code: number): string {
    const weatherIcons: { [key: number]: string } = {
      0: '☀️',
      1: '⛅',
      2: '⛅',
      3: '☁️',
      45: '🌫️',
      48: '🌫️',
      51: '🌦️',
      53: '🌦️',
      55: '🌦️',
      56: '🌨️',
      57: '🌨️',
      61: '🌧️',
      63: '🌧️',
      65: '🌧️',
      66: '🌨️',
      67: '🌨️',
      71: '❄️',
      73: '❄️',
      75: '❄️',
      77: '❄️',
      80: '🌧️',
      81: '🌧️',
      82: '🌧️',
      85: '🌨️',
      86: '🌨️',
      95: '⛈️',
      96: '⛈️',
      99: '⛈️'
    };
    return weatherIcons[code] || '❓';
  }

  getWeatherDescription(code: number): string {
    const weatherDescriptions: { [key: number]: string } = {
      0: 'Céu limpo',
      1: 'Parcialmente nublado',
      2: 'Parcialmente nublado',
      3: 'Nublado',
      45: 'Neblina',
      48: 'Neblina com geada',
      51: 'Chuvisco leve',
      53: 'Chuvisco moderado',
      55: 'Chuvisco intenso',
      56: 'Chuvisco gelado leve',
      57: 'Chuvisco gelado intenso',
      61: 'Chuva leve',
      63: 'Chuva moderada',
      65: 'Chuva intensa',
      66: 'Chuva gelada leve',
      67: 'Chuva gelada intensa',
      71: 'Neve leve',
      73: 'Neve moderada',
      75: 'Neve intensa',
      77: 'Grãos de neve',
      80: 'Aguaceiros leves',
      81: 'Aguaceiros moderados',
      82: 'Aguaceiros intensos',
      85: 'Aguaceiros de neve leves',
      86: 'Aguaceiros de neve intensos',
      95: 'Trovoada',
      96: 'Trovoada com granizo leve',
      99: 'Trovoada com granizo intenso'
    };
    return weatherDescriptions[code] || 'Condição desconhecida';
  }

  goBack() {
    this.router.navigate(['/dashboard'], {
      queryParams: {
        lat: this.route.snapshot.queryParams['lat'],
        lon: this.route.snapshot.queryParams['lon'],
        city: this.route.snapshot.queryParams['city']
      }
    });
  }
} 