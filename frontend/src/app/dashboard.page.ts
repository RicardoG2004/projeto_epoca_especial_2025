import { Component } from '@angular/core';
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
    <div
      style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #e3f0ff 0%, #fafcff 100%); padding: 2rem;"
    >
      <div
        style="max-width: 1200px; width: 100%; padding: 2.5rem 2rem; border-radius: 16px; box-shadow: 0 8px 32px rgba(60,60,120,0.10), 0 1.5px 6px rgba(60,60,120,0.08); background: #fff; margin: auto; display: flex; flex-direction: column; align-items: center;"
      >
        <h2 style="color: #1976d2; font-weight: 700; margin-bottom: 1.5rem;">
          WeatherMap
        </h2>
        <p style="font-size: 1.2rem; color: #333; text-align: center;">
          Bem Vindo, escolha a cidade que deseja procurar.
        </p>
        <form
          (ngSubmit)="searchAddress()"
          style="width:100%; margin-top:2rem; display:flex; flex-direction:column; align-items:center; gap:1rem;"
        >
          <input
            [(ngModel)]="address"
            name="address"
            required
            placeholder="Digite o nome da cidade"
            style="width:100%; max-width:400px; padding:0.75rem; border-radius:8px; border:1px solid #cfd8dc; font-size:1rem; background:#f7fbff; text-align:center;"
          />
          <button
            type="submit"
            style="padding:0.7rem 1.5rem; border-radius:8px; background:#1976d2; color:#fff; border:none; font-weight:bold; font-size:1rem; cursor:pointer;"
          >
            Mostrar mapa e meteorologia
          </button>
        </form>
        <div *ngIf="error" style="color:#d32f2f; margin-top:1rem;">
          {{ error }}
        </div>
        
        <!-- Results Container -->
        <div *ngIf="weatherData || (lat && lon)" style="width:100%; margin-top:2rem; display:grid; grid-template-columns:1fr 1fr; gap:2rem;">
          
          <!-- Weather Information Card -->
          <div *ngIf="weatherData" style="padding:1.5rem; background:linear-gradient(135deg, #f8f9ff 0%, #e8f4fd 100%); border-radius:12px; border:1px solid #e3f2fd; box-shadow:0 4px 16px rgba(25,118,210,0.1);">
            <h3 style="color:#1976d2; margin-bottom:1.5rem; text-align:center; font-size:1.4rem; font-weight:600;">
              🌤️ Meteorologia em {{ weatherData.name }}
            </h3>
            
            <!-- Weather Icon and Main Info -->
            <div style="text-align:center; margin-bottom:1.5rem; padding:1.5rem; background:#fff; border-radius:12px; box-shadow:0 4px 12px rgba(0,0,0,0.1);">
              <div style="font-size:4rem; margin-bottom:0.5rem;">
                {{ weatherData.weather[0].icon }}
              </div>
              <div style="font-size:2.5rem; font-weight:bold; color:#1976d2; margin-bottom:0.5rem;">
                {{ Math.round(weatherData.main.temp) }}°C
              </div>
              <div style="color:#666; font-size:1.1rem; text-transform:capitalize;">
                {{ weatherData.weather[0].description }}
              </div>
            </div>
            
            <!-- Weather Details Grid -->
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-bottom:1.5rem;">
              <div style="text-align:center; padding:1rem; background:#fff; border-radius:8px; box-shadow:0 2px 8px rgba(0,0,0,0.08);">
                <div style="font-size:1.8rem; font-weight:bold; color:#1976d2;">
                  {{ Math.round(weatherData.main.feels_like) }}°C
                </div>
                <div style="color:#666; font-size:0.9rem;">Sensação Térmica</div>
              </div>
              <div style="text-align:center; padding:1rem; background:#fff; border-radius:8px; box-shadow:0 2px 8px rgba(0,0,0,0.08);">
                <div style="font-size:1.8rem; font-weight:bold; color:#1976d2;">
                  {{ weatherData.main.humidity }}%
                </div>
                <div style="color:#666; font-size:0.9rem;">Humidade</div>
              </div>
            </div>
            
            <div style="text-align:center; padding:1rem; background:#fff; border-radius:8px; box-shadow:0 2px 8px rgba(0,0,0,0.08); margin-bottom:1.5rem;">
              <div style="font-size:1.8rem; font-weight:bold; color:#1976d2;">
                {{ Math.round(weatherData.wind.speed) }} km/h
              </div>
              <div style="color:#666; font-size:0.9rem;">Velocidade do Vento</div>
            </div>

            <!-- Forecast Button -->
            <button
              (click)="goToForecast()"
              style="width:100%; padding:1rem; border-radius:8px; background:linear-gradient(135deg, #4caf50 0%, #45a049 100%); color:#fff; border:none; font-weight:bold; font-size:1rem; cursor:pointer; transition:all 0.2s; box-shadow:0 4px 12px rgba(76,175,80,0.3);"
            >
              📅 Ver Previsão para os Próximos Dias
            </button>
          </div>
          
          <!-- Map Card -->
          <div *ngIf="lat && lon" style="padding:1.5rem; background:linear-gradient(135deg, #f8f9ff 0%, #e8f4fd 100%); border-radius:12px; border:1px solid #e3f2fd; box-shadow:0 4px 16px rgba(25,118,210,0.1);">
            <h3 style="color:#1976d2; margin-bottom:1.5rem; text-align:center; font-size:1.4rem; font-weight:600;">
              🗺️ Localização de {{ currentCityName }}
            </h3>
            <div
              id="map"
              style="width:100%; height:400px; border-radius:12px; box-shadow:0 4px 12px rgba(25,118,210,0.1); background:#f0f8ff;"
            ></div>
          </div>
          
        </div>
      </div>
    </div>
  `,
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

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute) {}

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
    // Pré-carregar Leaflet
    this.loadLeaflet();
  }
}
