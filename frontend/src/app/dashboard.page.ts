import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

interface WeatherData {
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
  };
  name: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  template: `
    <div class="dashboard-container">
      <!-- Background with animated elements -->
      <div class="background-animation">
        <div class="floating-shape shape-1"></div>
        <div class="floating-shape shape-2"></div>
        <div class="floating-shape shape-3"></div>
      </div>

      <!-- Main content -->
      <div class="dashboard-content">
        <!-- Dashboard content -->
        <div class="dashboard-card">
          <div class="card-header">
            <h2 class="welcome-text">Bem-vindo ao WeatherMap!</h2>
            <p class="dashboard-description">Escolha a cidade que deseja procurar</p>
          </div>

          <!-- Search Section -->
          <form (ngSubmit)="searchAddress()" class="search-form">
            <div class="input-group">
              <label class="input-label">
                <span class="label-icon">🔍</span>
                Cidade
              </label>
              <input
                [(ngModel)]="address"
                name="address"
                required
                placeholder="Digite o nome da cidade"
                class="form-input"
              />
            </div>
            <button type="submit" class="search-button">
              <span>Mostrar mapa e meteorologia</span>
            </button>
          </form>

          <div *ngIf="error" class="error-message">
            {{ error }}
          </div>
          
          <!-- Results Container -->
          <div *ngIf="weatherData || (lat && lon)" class="results-container">
            
            <!-- Weather Information Card -->
            <div *ngIf="weatherData" class="weather-card">
              <h3 class="weather-title">
                🌤️ Meteorologia em {{ weatherData.name }}
              </h3>
              
              <!-- Weather Icon and Main Info -->
              <div class="weather-main">
                <div class="weather-icon">
                  {{ weatherData.weather[0].icon }}
                </div>
                <div class="temperature">
                  {{ Math.round(weatherData.main.temp) }}°C
                </div>
                <div class="weather-description">
                  {{ weatherData.weather[0].description }}
                </div>
              </div>
              
              <!-- Weather Details Grid -->
              <div class="weather-details">
                <div class="detail-item">
                  <div class="detail-value">
                    {{ Math.round(weatherData.main.feels_like) }}°C
                  </div>
                  <div class="detail-label">Sensação Térmica</div>
                </div>
                <div class="detail-item">
                  <div class="detail-value">
                    {{ weatherData.main.humidity }}%
                  </div>
                  <div class="detail-label">Humidade</div>
                </div>
                <div class="detail-item">
                  <div class="detail-value">
                    {{ Math.round(weatherData.wind.speed) }} km/h
                  </div>
                  <div class="detail-label">Velocidade do Vento</div>
                </div>
              </div>

              <!-- Forecast Button -->
              <button (click)="goToForecast()" class="forecast-button">
                📅 Ver Previsão para os Próximos Dias
              </button>
            </div>
            
            <!-- Map Card -->
            <div *ngIf="lat && lon" class="map-card">
              <h3 class="map-title">
                🗺️ Localização de {{ currentCityName }}
              </h3>
              <div id="map" class="map-container"></div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
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

    .dashboard-content {
      display: flex;
      justify-content: center;
      max-width: 1200px;
      width: 100%;
      z-index: 1;
    }

    .dashboard-card {
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
      text-align: center;
      margin-bottom: 2rem;
    }

    .welcome-text {
      font-size: 2rem;
      font-weight: 700;
      color: #1e3c72;
      margin: 0 0 0.5rem 0;
    }

    .dashboard-description {
      color: #666;
      font-size: 1rem;
      margin: 0;
    }

    .search-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      margin-bottom: 2rem;
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

    .search-button {
      padding: 1rem;
      background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
      color: white;
      border: none;
      border-radius: 12px;
      font-size: 1.1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .search-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(30, 60, 114, 0.3);
      background: linear-gradient(135deg, #2a5298 0%, #4a90e2 100%);
    }

    .error-message {
      color: #e74c3c;
      text-align: center;
      margin: 1rem 0;
      padding: 1rem;
      background: rgba(231, 76, 60, 0.1);
      border-radius: 8px;
    }

    .results-container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      margin-top: 2rem;
    }

    .weather-card, .map-card {
      background: linear-gradient(135deg, #f8f9ff 0%, #e8f4fd 100%);
      border-radius: 16px;
      padding: 2rem;
      border: 1px solid #e3f2fd;
      box-shadow: 0 8px 24px rgba(25,118,210,0.1);
    }

    .weather-title, .map-title {
      color: #1e3c72;
      margin-bottom: 1.5rem;
      text-align: center;
      font-size: 1.4rem;
      font-weight: 600;
    }

    .weather-main {
      text-align: center;
      margin-bottom: 1.5rem;
      padding: 1.5rem;
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    .weather-icon {
      font-size: 4rem;
      margin-bottom: 0.5rem;
    }

    .temperature {
      font-size: 2.5rem;
      font-weight: bold;
      color: #1e3c72;
      margin-bottom: 0.5rem;
    }

    .weather-description {
      color: #666;
      font-size: 1.1rem;
      text-transform: capitalize;
    }

    .weather-details {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .detail-item {
      text-align: center;
      padding: 1rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }

    .detail-value {
      font-size: 1.8rem;
      font-weight: bold;
      color: #1e3c72;
    }

    .detail-label {
      color: #666;
      font-size: 0.9rem;
      margin-top: 0.25rem;
    }

    .forecast-button {
      width: 100%;
      padding: 1rem;
      border-radius: 8px;
      background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
      color: white;
      border: none;
      font-weight: bold;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.2s;
      box-shadow: 0 4px 12px rgba(76,175,80,0.3);
    }

    .forecast-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(76,175,80,0.4);
    }

    .map-container {
      width: 100%;
      height: 400px;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(25,118,210,0.1);
      background: #f0f8ff;
    }

    @media (max-width: 768px) {
      .dashboard-card {
        padding: 2rem;
      }

      .results-container {
        grid-template-columns: 1fr;
        gap: 1rem;
      }
    }
  `]
})
export class DashboardPage {
  address = '';
  lat: number | null = null;
  lon: number | null = null;
  error = '';
  weatherData: WeatherData | null = null;
  Math = Math; // Para usar Math no template
  private currentMap: any = null; // Para armazenar a referência do mapa atual
  currentCityName = ''; // Para armazenar o nome da cidade atual

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Verificar se há parâmetros na URL (quando regressa da página de previsão)
    this.route.queryParams.subscribe(params => {
      const lat = params['lat'];
      const lon = params['lon'];
      const city = params['city'];
      
      if (lat && lon && city) {
        this.currentCityName = city;
        this.address = city; // Também atualizar o campo de pesquisa
        this.lat = parseFloat(lat);
        this.lon = parseFloat(lon);
        setTimeout(() => this.showMap(), 0);
        this.getWeatherData();
      }
    });
  }

  searchAddress() {
    this.error = '';
    this.weatherData = null;
    
    // Limpar mapa anterior se existir
    if (this.currentMap) {
      this.currentMap.remove();
      this.currentMap = null;
    }
    
    if (!this.address) return;
    this.http
      .get<any[]>(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          this.address
        )}`
      )
      .subscribe({
        next: (results) => {
          
          if (results.length > 0) {
            this.lat = parseFloat(results[0].lat);
            this.lon = parseFloat(results[0].lon);
            // Atualizar o nome da cidade atual apenas quando a pesquisa for bem-sucedida
            this.currentCityName = this.address;
            // Aguardar um pouco para garantir que o DOM seja atualizado
            setTimeout(() => {
              this.showMap();
            }, 200);
            this.getWeatherData();
            
            // Send webhook for city search
            this.sendCitySearchWebhook();
          } else {
            this.error = 'Cidade não encontrada.';
            this.lat = this.lon = null;
          }
        },
        error: () => {
          this.error = 'Erro ao buscar localização.';
          this.lat = this.lon = null;
        },
      });
  }

  sendCitySearchWebhook() {
    const token = localStorage.getItem('token');
    if (token) {
      // Decode JWT to get user info (basic implementation)
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const userEmail = payload.email;
        const userId = payload.sub;
        
        console.log(`🔍 Sending city search webhook for: ${this.currentCityName}`);
        console.log(`👤 User: ${userEmail} (${userId})`);
        
        this.http.post('http://localhost:3000/webhook/city-search', {
          city: this.currentCityName,
          userId: userId,
          userEmail: userEmail
        }).subscribe({
          next: () => console.log(`✅ City search webhook sent successfully for: ${this.currentCityName}`),
          error: (err) => console.error(`❌ Webhook error:`, err)
        });
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    } else {
      console.log(`🔴 No token found - webhook not sent for city: ${this.currentCityName}`);
    }
  }

  sendWeatherFetchWebhook() {
    const token = localStorage.getItem('token');
    if (token && this.lat && this.lon) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const userEmail = payload.email;
        const userId = payload.sub;
        
        console.log(`🌤️ Sending weather fetch webhook for: ${this.currentCityName}`);
        console.log(`📍 Coordinates: ${this.lat}, ${this.lon}`);
        console.log(`👤 User: ${userEmail} (${userId})`);
        
        this.http.post('http://localhost:3000/webhook/weather-fetch', {
          city: this.currentCityName,
          lat: this.lat,
          lon: this.lon,
          userId: userId,
          userEmail: userEmail
        }).subscribe({
          next: () => console.log(`✅ Weather fetch webhook sent successfully for: ${this.currentCityName}`),
          error: (err) => console.error(`❌ Webhook error:`, err)
        });
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    } else {
      console.log(`🔴 No token or coordinates - webhook not sent for city: ${this.currentCityName}`);
    }
  }

  getWeatherData() {
    if (!this.lat || !this.lon) return;
    
    // Buscar dados meteorológicos atuais
    const currentUrl = `https://api.open-meteo.com/v1/forecast?latitude=${this.lat}&longitude=${this.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weather_code&timezone=auto`;
    
    this.http.get<any>(currentUrl).subscribe({
      next: (data) => {
        // Converter dados da API Open-Meteo para o formato esperado
        this.weatherData = {
          main: {
            temp: data.current.temperature_2m,
            feels_like: data.current.apparent_temperature,
            humidity: data.current.relative_humidity_2m,
            pressure: 0 // Não disponível nesta API
          },
          weather: [{
            main: this.getWeatherDescription(data.current.weather_code),
            description: this.getWeatherDescription(data.current.weather_code),
            icon: this.getWeatherIcon(data.current.weather_code)
          }],
          wind: {
            speed: data.current.wind_speed_10m
          },
          name: this.currentCityName
        };
        
        // Send webhook for weather fetch
        this.sendWeatherFetchWebhook();
      },
      error: (err) => {
        console.error('Erro ao buscar dados meteorológicos atuais:', err);
      }
    });
  }

  goToForecast() {
    if (this.lat && this.lon && this.currentCityName) {
      this.router.navigate(['/forecast'], {
        queryParams: {
          lat: this.lat,
          lon: this.lon,
          city: this.currentCityName
        }
      });
    }
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

  showMap() {
    // Aguardar um pouco mais para garantir que o DOM esteja pronto
    setTimeout(() => {
      if (!(window as any).L) {
        // Se Leaflet não estiver carregado, carregar primeiro
        this.loadLeaflet().then(() => {
          this.initializeMap();
        });
      } else {
        this.initializeMap();
      }
    }, 100);
  }

  initializeMap() {
    const mapContainer = document.getElementById('map');
    if (!mapContainer || !this.lat || !this.lon) return;
    
    // Destruir o mapa anterior se existir
    if (this.currentMap) {
      this.currentMap.remove();
      this.currentMap = null;
    }
    
    // Limpar o container
    mapContainer.innerHTML = '';
    
    try {
      // Criar novo mapa
      this.currentMap = (window as any).L.map('map').setView([this.lat, this.lon], 14);
      
      // Adicionar camada de tiles
      (window as any).L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
          maxZoom: 19,
          attribution: '© OpenStreetMap',
        }
      ).addTo(this.currentMap);
      
      // Adicionar marcador
      (window as any).L.marker([this.lat, this.lon]).addTo(this.currentMap);
      
      // Forçar redraw do mapa
      setTimeout(() => {
        if (this.currentMap) {
          this.currentMap.invalidateSize();
        }
      }, 100);
      
    } catch (error) {
      console.error('Erro ao inicializar mapa:', error);
    }
  }

  loadLeaflet(): Promise<void> {
    return new Promise((resolve) => {
      // Verificar se já está carregado
      if ((window as any).L) {
        resolve();
        return;
      }

      // Carregar CSS
      if (!document.querySelector('link[href*="leaflet.css"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet/dist/leaflet.css';
        document.head.appendChild(link);
      }

      // Carregar JavaScript
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet/dist/leaflet.js';
      script.onload = () => {
        resolve();
      };
      script.onerror = () => {
        console.error('Erro ao carregar Leaflet');
        resolve();
      };
      document.body.appendChild(script);
    });
  }

  ngAfterViewInit() {
    this.loadLeaflet();
  }
}
