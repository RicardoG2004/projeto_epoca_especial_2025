import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  template: `
    <div
      style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #e3f0ff 0%, #fafcff 100%);"
    >
      <div
        style="max-width: 500px; width: 100%; padding: 2.5rem 2rem; border-radius: 16px; box-shadow: 0 8px 32px rgba(60,60,120,0.10), 0 1.5px 6px rgba(60,60,120,0.08); background: #fff; margin: auto; display: flex; flex-direction: column; align-items: center;"
      >
        <h2 style="color: #1976d2; font-weight: 700; margin-bottom: 1.5rem;">
          Dashboard
        </h2>
        <p style="font-size: 1.2rem; color: #333; text-align: center;">
          Welcome! You are logged in and can access this protected page.
        </p>
        <form
          (ngSubmit)="searchAddress()"
          style="width:100%; margin-top:2rem; display:flex; flex-direction:column; align-items:center; gap:1rem;"
        >
          <input
            [(ngModel)]="address"
            name="address"
            required
            placeholder="Enter address"
            style="width:100%; padding:0.75rem; border-radius:8px; border:1px solid #cfd8dc; font-size:1rem; background:#f7fbff; text-align:center;"
          />
          <button
            type="submit"
            style="padding:0.7rem 1.5rem; border-radius:8px; background:#1976d2; color:#fff; border:none; font-weight:bold; font-size:1rem; cursor:pointer;"
          >
            Show on Map
          </button>
        </form>
        <div *ngIf="error" style="color:#d32f2f; margin-top:1rem;">
          {{ error }}
        </div>
        <div
          id="map"
          style="width:100%; height:300px; margin-top:2rem; border-radius:12px; box-shadow:0 2px 8px rgba(25,118,210,0.08);"
          *ngIf="lat && lon"
        ></div>
      </div>
    </div>
  `,
})
export class DashboardPage {
  address = '';
  lat: number | null = null;
  lon: number | null = null;
  error = '';

  constructor(private http: HttpClient, private router: Router) {}

  searchAddress() {
    this.error = '';
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
            setTimeout(() => this.showMap(), 0);
          } else {
            this.error = 'Address not found.';
            this.lat = this.lon = null;
          }
        },
        error: () => {
          this.error = 'Failed to fetch location.';
          this.lat = this.lon = null;
        },
      });
  }

  showMap() {
    if (!(window as any).L) return;
    const mapContainer = document.getElementById('map');
    if (!mapContainer) return;
    mapContainer.innerHTML = '';
    const map = (window as any).L.map('map').setView([this.lat, this.lon], 14);
    (window as any).L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 19,
        attribution: '© OpenStreetMap',
      }
    ).addTo(map);
    (window as any).L.marker([this.lat, this.lon]).addTo(map);
  }

  ngAfterViewInit() {
    // Load Leaflet if not already loaded
    if (!(window as any).L) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet/dist/leaflet.css';
      document.head.appendChild(link);
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet/dist/leaflet.js';
      script.onload = () => {};
      document.body.appendChild(script);
    }
  }
}
