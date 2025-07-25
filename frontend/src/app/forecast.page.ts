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
    <div
      style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #e3f0ff 0%, #fafcff 100%); padding: 2rem;"
    >
      <div
        style="max-width: 1000px; width: 100%; padding: 2.5rem 2rem; border-radius: 16px; box-shadow: 0 8px 32px rgba(60,60,120,0.10), 0 1.5px 6px rgba(60,60,120,0.08); background: #fff; margin: auto; display: flex; flex-direction: column; align-items: center;"
      >
        <div style="display: flex; align-items: center; justify-content: space-between; width: 100%; margin-bottom: 2rem;">
          <h2 style="color: #1976d2; font-weight: 700; margin: 0;">
            📅 Previsão Meteorológica
          </h2>
          <button
            (click)="goBack()"
            style="padding: 0.7rem 1.5rem; border-radius: 8px; background: #fff; color: #1976d2; border: 2px solid #1976d2; font-weight: bold; font-size: 1rem; cursor: pointer; transition: all 0.2s;"
          >
            ← Voltar
          </button>
        </div>

        <div *ngIf="cityName" style="text-align: center; margin-bottom: 2rem;">
          <h3 style="color: #333; font-size: 1.5rem; margin-bottom: 0.5rem;">
            {{ cityName }}
          </h3>
          <p style="color: #666; font-size: 1.1rem;">
            Previsão para os próximos 7 dias
          </p>
        </div>

        <div *ngIf="loading" style="text-align: center; padding: 2rem;">
          <div style="font-size: 2rem; margin-bottom: 1rem;">⏳</div>
          <p style="color: #666;">A carregar previsão meteorológica...</p>
        </div>

        <div *ngIf="error" style="text-align: center; padding: 2rem; color: #d32f2f;">
          <div style="font-size: 2rem; margin-bottom: 1rem;">⚠️</div>
          <p>{{ error }}</p>
        </div>

        <!-- Forecast Grid -->
        <div *ngIf="forecastData && !loading" style="width: 100%;">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem;">
            <div *ngFor="let day of forecastData.daily.time; let i = index" 
                 style="padding: 1.5rem; background: linear-gradient(135deg, #f8f9ff 0%, #e8f4fd 100%); border-radius: 12px; border: 1px solid #e3f2fd; box-shadow: 0 4px 16px rgba(25,118,210,0.1);">
              
              <!-- Day Header -->
              <div style="text-align: center; margin-bottom: 1.5rem;">
                <div style="font-size: 1.3rem; font-weight: 600; color: #1976d2; margin-bottom: 0.5rem;">
                  {{ formatDate(day) }}
                </div>
                <div style="font-size: 0.9rem; color: #666;">
                  {{ formatFullDate(day) }}
                </div>
              </div>

              <!-- Weather Icon and Temperature -->
              <div style="text-align: center; margin-bottom: 1.5rem;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">
                  {{ getWeatherIcon(forecastData.daily.weather_code[i]) }}
                </div>
                <div style="display: flex; justify-content: center; align-items: center; gap: 1rem;">
                  <div style="text-align: center;">
                    <div style="font-size: 1.8rem; font-weight: bold; color: #1976d2;">
                      {{ Math.round(forecastData.daily.temperature_2m_max[i]) }}°
                    </div>
                    <div style="font-size: 0.8rem; color: #666;">Máxima</div>
                  </div>
                  <div style="width: 1px; height: 40px; background: #e0e0e0;"></div>
                  <div style="text-align: center;">
                    <div style="font-size: 1.8rem; font-weight: bold; color: #666;">
                      {{ Math.round(forecastData.daily.temperature_2m_min[i]) }}°
                    </div>
                    <div style="font-size: 0.8rem; color: #666;">Mínima</div>
                  </div>
                </div>
              </div>

              <!-- Weather Description -->
              <div style="text-align: center; margin-bottom: 1rem;">
                <div style="font-size: 1rem; color: #333; text-transform: capitalize;">
                  {{ getWeatherDescription(forecastData.daily.weather_code[i]) }}
                </div>
              </div>

              <!-- Precipitation Probability -->
              <div *ngIf="forecastData.daily.precipitation_probability_max[i] > 0" 
                   style="text-align: center; padding: 0.8rem; background: rgba(25,118,210,0.1); border-radius: 8px;">
                <div style="font-size: 0.9rem; color: #1976d2; font-weight: 600;">
                  💧 {{ forecastData.daily.precipitation_probability_max[i] }}% de probabilidade de chuva
                </div>
              </div>

              <!-- No Rain Message -->
              <div *ngIf="forecastData.daily.precipitation_probability_max[i] === 0" 
                   style="text-align: center; padding: 0.8rem; background: rgba(76,175,80,0.1); border-radius: 8px;">
                <div style="font-size: 0.9rem; color: #4caf50; font-weight: 600;">
                  ☀️ Sem precipitação prevista
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
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